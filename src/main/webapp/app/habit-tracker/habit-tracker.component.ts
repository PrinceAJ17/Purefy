import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Habit {
  name: string;
  done: boolean;
}

@Component({
  selector: 'jhi-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.scss'],
})
export class HabitTrackerComponent implements OnInit {
  constructor(private router: Router) {}

  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  habits: { [key: string]: Habit[] } = {};
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

  // functionality code

  generateNewWeekHabitTracker(): void {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const daysToAdd = currentDay === 0 ? 1 : 8 - currentDay;
    this.nextMonday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysToAdd);

    this.daysOfWeek.forEach(day => {
      this.habits[day] = [
        { name: 'Wake up at 6 AM', done: false },
        { name: 'Gym', done: false },
        { name: '4 hrs focus work', done: false },
        { name: 'Eat healthy', done: false },
        { name: 'Drink 2L of water', done: false },
      ];
    });
  }

  addNewHabit(day: string): void {
    if (!this.habits[day]) {
      this.habits[day] = [];
    }
    this.habits[day].push({ name: 'New Habit', done: false });
  }

  toggleHabitStatus(day: string, index: number, event: any): void {
    const habit = this.habits[day][index];
    habit.done = !habit.done;
  }

  removeHabit(day: string): void {
    if (this.habits[day] && this.habits[day].length > 0) {
      this.habits[day].pop();
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }
}
