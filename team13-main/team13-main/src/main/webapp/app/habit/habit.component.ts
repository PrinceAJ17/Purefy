import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitstrackingService } from '../entities/habitstracking/service/habitstracking.service';
import { AccountService } from '../core/auth/account.service';
import { NewHabitstracking, IHabitstracking } from '../entities/habitstracking/habitstracking.model';

@Component({
  selector: 'jhi-habit',
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
})
export class HabitComponent implements OnInit {
  constructor(private router: Router, private weeklyService: HabitstrackingService, private account: AccountService) {}

  week: number = 1;
  addDay: string | undefined;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  habits: { [key: string]: IHabitstracking[] } = {};
  username: string | undefined;
  addingHabit: { [key: string]: boolean } = {};
  newHabitName: { [key: string]: string } = {};
  predefinedHabits: string[] = ['Drink 2L of water', '4 hours of focus work', 'Gym', 'Eat healthy'];

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('src/main/webapp/vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('src/main/webapp/vendor/jquery/jquery.slim.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/isotope.min.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/owl-carousel.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/tabs.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/popup.js'))
      .then(() => this.loadScript('src/main/webapp/assets/js/custom.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });

    this.user();
    this.week = this.getCurrentWeekNumber();
    this.loadAllHabits();

    this.daysOfWeek.forEach(day => {
      this.addingHabit[day] = false;
      this.newHabitName[day] = '';
    });
  }

  getCurrentWeekNumber(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.valueOf() - startOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }

  user(): void {
    this.account.getAccount().subscribe({
      next: account => {
        this.username = account.login;
        console.log('Account fetched:', account);
      },
      error: error => {
        console.error('Error fetching account:', error);
      },
    });
  }

  loadAllHabits() {
    this.weeklyService.getAllHabitstrackings().subscribe(data => {
      // Initialize the habits object with keys for each day of the week
      this.daysOfWeek.forEach(day => {
        this.habits[day] = [];
      });

      // Organize habits by day of the week
      data.forEach(habit => {
        if (habit.dayOfHabit && this.habits[habit.dayOfHabit]) {
          this.habits[habit.dayOfHabit].push(habit);
        } else {
          console.log('no habits');
        }
      });
    });
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

  // functionality code

  generateNewWeeklyHabitTracker() {
    const newHabits: NewHabitstracking[] = [];

    this.daysOfWeek.forEach(day => {
      this.predefinedHabits.forEach(habitName => {
        const newHabit: NewHabitstracking = {
          id: null,
          nameOfHabit: habitName,
          dayOfHabit: day,
          weekOfHabit: this.week,
          completedHabit: false,
          usernameHabit: this.username,
          habitIDEN: null,
        };
        this.weeklyService.create(newHabit).subscribe({
          next: response => console.log('Habit created:', response),
          error: error => console.error('Error creating habit:', error),
        });
      });
    });
    window.location.reload();
  }

  saveHabit(name: string, dayOfWeek: string, weekNumber: number): void {
    const iden = this.daysOfWeek.indexOf(dayOfWeek) + 1;
    const concatenatedString: string = iden.toString() + weekNumber.toString();
    const id: number = parseInt(concatenatedString, 10);
    const newHabit: NewHabitstracking = {
      habitIDEN: id,
      nameOfHabit: name,
      completedHabit: false,
      dayOfHabit: dayOfWeek,
      weekOfHabit: weekNumber,
      usernameHabit: this.username,
      id: null,
    };

    this.weeklyService.create(newHabit).subscribe({
      next: habit => {
        console.log('Saved successfully', habit);
      },
      error: () => {
        console.error('Error saving the habit');
      },
    });
    window.location.reload();
  }

  onHabitNameChange(newName: any, habitId: number): void {
    console.log(newName);
    if (this.addDay) {
      this.saveHabit(newName, this.addDay, this.week);
      console.log('saved');
      this.markNameAsFinalized(habitId);
    }
  }

  startAddingHabit(day: string): void {
    this.addingHabit[day] = true;
  }

  submitNewHabit(name: string, dayOfWeek: string): void {
    const weekNumber = this.getCurrentWeekNumber();
    this.saveHabit(name, dayOfWeek, weekNumber);
    this.addingHabit[dayOfWeek] = false;
    this.newHabitName[dayOfWeek] = '';
  }

  toggleHabitCompletion(habit: IHabitstracking): void {
    this.weeklyService.toggleCompletedHabit(habit).subscribe({
      next: response => {
        console.log('Habit completion toggled:', response.body);
      },
      error: error => {
        console.error('Error toggling habit completion', error);
      },
    });
  }

  markNameAsFinalized(habitId: number): void {
    const finalizedHabits = JSON.parse(localStorage.getItem('finalizedHabits') || '[]');
    if (!finalizedHabits.includes(habitId)) {
      finalizedHabits.push(habitId);
      localStorage.setItem('finalizedHabits', JSON.stringify(finalizedHabits));
    }
  }

  isNameFinalized(habitId: number): boolean {
    const finalizedHabits = JSON.parse(localStorage.getItem('finalizedHabits') || '[]');
    return finalizedHabits.includes(habitId);
  }

  removeHabit(day: string, habitId: number): void {
    this.habits[day] = this.habits[day].filter(habit => habit.id !== habitId);
    this.weeklyService.delete(habitId).subscribe({
      next: () => {
        console.log(`Habit with ID ${habitId} removed successfully.`);
      },
      error: error => {
        console.error('Error removing habit:', error);
      },
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }
}
