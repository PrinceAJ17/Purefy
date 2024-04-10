import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrackedHabitService } from '../entities/tracked-habit/service/tracked-habit.service';
import { ITrackedHabit, NewTrackedHabit } from '../entities/tracked-habit/tracked-habit.model';
import { HabitService } from '../entities/habit/service/habit.service';
import { IHabit, NewHabit } from '../entities/habit/habit.model';
import { default as dayjs } from 'dayjs';
import { AccountService } from '../core/auth/account.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WeeklySummaryService } from '../entities/weekly-summary/service/weekly-summary.service';
import { IWeeklySummary, NewWeeklySummary } from '../entities/weekly-summary/weekly-summary.model';

interface Habit {
  name: string;
  done: boolean;
}

interface WeeklyHabits {
  weekID?: number | null; // Allow weekID to be null
  nextMonday: Date;
  habits: { [key: string]: Habit[] };
  weeklySummary: string;
}

@Component({
  selector: 'jhi-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.scss'],
})
export class HabitTrackerComponent implements OnInit {
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  weeklyHabits: WeeklyHabits[] = [];
  currentWeekIndex = 0;

  constructor(
    private router: Router,
    private trackedHabitService: TrackedHabitService,
    private habitService: HabitService,
    private account: AccountService,
    private weeklySummaryService: WeeklySummaryService
  ) {}

  ngOnInit(): void {
    this.generateNewWeekHabitTracker();
  }

  generateNewWeekHabitTracker(): void {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize the time to the start of the day.
    const dayOfWeek = currentDate.getDay();
    const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If today is Sunday, the difference is -6; otherwise, it's 1 - current day of the week.
    const nextMonday = new Date(currentDate.setDate(currentDate.getDate() + difference));

    const newWeeklyHabits: WeeklyHabits = {
      nextMonday,
      habits: {},
      weeklySummary: '',
    };

    this.daysOfWeek.forEach(day => {
      newWeeklyHabits.habits[day] = [
        { name: 'Wake up at 6 AM', done: false },
        { name: 'Gym', done: false },
        { name: '4 hrs focus work', done: false },
        { name: 'Eat healthy', done: false },
        { name: 'Drink 2L of water', done: false },
      ];
    });

    this.weeklyHabits.unshift(newWeeklyHabits); // Add the new week to the start of the array.
    this.updatePreviousWeeksDates(); // Ensure all previous weeks are updated.
  }

  updatePreviousWeeksDates(): void {
    for (let i = 1; i < this.weeklyHabits.length; i++) {
      const previousMonday = new Date(this.weeklyHabits[i - 1].nextMonday);
      previousMonday.setDate(previousMonday.getDate() - 7);
      this.weeklyHabits[i].nextMonday = previousMonday;
    }
  }

  addNewHabit(day: string): void {
    if (!this.weeklyHabits[0].habits[day]) {
      this.weeklyHabits[0].habits[day] = [];
    }
    this.weeklyHabits[0].habits[day].push({ name: 'New Habit', done: false });
  }

  toggleHabitStatus(day: string, index: number, event: any): void {
    const habit = this.weeklyHabits[0].habits[day][index];
    habit.done = !habit.done;
  }

  removeHabit(day: string): void {
    if (this.weeklyHabits[0].habits[day] && this.weeklyHabits[0].habits[day].length > 0) {
      this.weeklyHabits[0].habits[day].pop();
    }
  }

  saveSummary(weekIndex: number): void {
    // Access the specific week's data using weekIndex
    const weekData = this.weeklyHabits[weekIndex];
    const summaryToSave: NewWeeklySummary | IWeeklySummary = {
      id: weekData.weekID ?? null, // Use null if weekID is undefined
      summaryText: weekData.weeklySummary,
      // Any other properties needed
    };

    if (summaryToSave.id !== null) {
      this.weeklySummaryService.update(summaryToSave as IWeeklySummary).subscribe({
        next: res => {
          console.log('Summary updated', res.body);
          // Update the weekID with the ID from the response
          this.weeklyHabits[weekIndex].weekID = res.body?.id ?? null;
        },
        error: () => {
          console.error('Error updating summary');
        },
      });
    } else {
      this.weeklySummaryService.create(summaryToSave as NewWeeklySummary).subscribe({
        next: res => {
          console.log('Summary created', res.body);
          // Assign the newly created ID to weekID
          this.weeklyHabits[weekIndex].weekID = res.body?.id ?? null;
        },
        error: () => {
          console.error('Error creating summary');
        },
      });
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }
}
