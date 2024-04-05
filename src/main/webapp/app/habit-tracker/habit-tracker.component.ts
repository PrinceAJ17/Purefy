import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Habit {
  id: number;
  habitExtendedID: number;
  habitExtendedName: string;
  habitCompletionCheckbox: boolean;
  habitDate: Date;
}

interface WeeklyHabits {
  [key: string]: Habit[];
}

@Component({
  selector: 'jhi-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.scss'],
})
export class HabitTrackerComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  habits: WeeklyHabits = {};
  nextMonday: Date | undefined;

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('src/main/webapp/vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('src/main/webapp/vendor/jquery/jquery.slim.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/isotope.min.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/owl-carousel.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/tabs.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/popup.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/custom.js'))
      .then(() => this.loadHabit(1, 'Monday'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });

    this.generateNewWeekHabitTracker();
  }

  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = document.body as HTMLDivElement;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = false; // Important for sequential loading
      script.onload = () => resolve();
      script.onerror = error => reject(error);
      body.appendChild(script);
    });
  }

  getHabitById(id: number): Observable<Habit> {
    return this.http.get<Habit>(`/habit-extendeds/${id}`);
  }

  loadHabit(id: number, day: string): void {
    this.getHabitById(id).subscribe({
      next: data => {
        // Assuming you want to add the habit to a specific day. This example arbitrarily adds it to 'Monday'.
        // You might need logic to determine the correct day based on the habit data.
        if (!this.habits[day]) {
          this.habits[day] = [];
        }
        this.habits[day].push(data);
      },
      error: err => console.error(err),
    });
  }

  // functionality code

  generateNewWeekHabitTracker(): void {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const daysToAdd = currentDay === 0 ? 1 : 8 - currentDay;
    this.nextMonday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysToAdd);

    this.daysOfWeek.forEach(day => {
      this.habits[day] = [
        {
          id: 1,
          habitExtendedID: 1,
          habitExtendedName: 'Wake up at 6 AM',
          habitCompletionCheckbox: false,
          habitDate: new Date(2023, 0, 1, 12, 0, 0),
        },
        { id: 2, habitExtendedID: 2, habitExtendedName: 'Gym', habitCompletionCheckbox: false, habitDate: new Date(2022, 0, 1, 12, 0, 0) },
        {
          id: 3,
          habitExtendedID: 3,
          habitExtendedName: '4 hrs focus work',
          habitCompletionCheckbox: false,
          habitDate: new Date(2021, 0, 1, 12, 0, 0),
        },
        {
          id: 4,
          habitExtendedID: 4,
          habitExtendedName: 'Eat healthy',
          habitCompletionCheckbox: false,
          habitDate: new Date(2013, 0, 1, 12, 0, 0),
        },
        {
          id: 5,
          habitExtendedID: 5,
          habitExtendedName: 'Drink 2L of water',
          habitCompletionCheckbox: false,
          habitDate: new Date(2023, 0, 1, 12, 0, 0),
        },
      ];
    });
  }

  addNewHabit(day: string): void {
    if (!this.habits[day]) {
      this.habits[day] = [];
    }
    // Adding missing properties for new habits
    this.habits[day].push({
      id: Date.now(),
      habitExtendedID: Date.now(),
      habitExtendedName: 'New Habit',
      habitCompletionCheckbox: false,
      habitDate: new Date(),
    });
  }

  toggleHabitStatus(day: string, index: number, event: any): void {
    const habit = this.habits[day][index];
    habit.habitCompletionCheckbox = !habit.habitCompletionCheckbox;
  }

  removeHabit(day: string): void {
    if (this.habits[day] && this.habits[day].length > 0) {
      this.habits[day].pop();
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) {
      return '';
    }
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }
}
