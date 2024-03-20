import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-alcohol-start',
  templateUrl: './alcohol-start.component.html',
  styleUrls: ['./alcohol-start.component.scss'],
})
export class AlcoholStartComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  currentState: string | undefined;
  timers: { [timerId: string]: string } = {};
  challengeCompleted: { [timerId: string]: boolean } = {};
  timerIntervals: { [timerId: string]: any } = {};

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/isotope.min.js'))
      .then(() => this.loadScript('assets/js/owl-carousel.js'))
      .then(() => this.loadScript('assets/js/tabs.js'))
      .then(() => this.loadScript('assets/js/popup.js'))
      .then(() => this.loadScript('assets/js/custom.js'))
      .then(() => {
        console.log('All scripts loaded successfully');
        // Initialization or callback functions that depend on these scripts can go here
      })
      .catch(error => {
        console.error('Script loading error:', error);
      });

    this.route.params.subscribe(params => {
      // You might set a default state if 'state' param is not provided
      this.currentState = params['state']; // Could be undefined if not provided

      if (!this.currentState) {
        // Handle the case when currentState is undefined,
        // for example, by setting a default value or redirecting
        this.currentState = 'defaultState'; // Set a default state or implement other logic
      }
    });

    // Timer code
    this.checkTimers();
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

  //timer code

  // Start a timer with a given id and duration in hours
  startTimer(timerId: string, durationInHours: number): void {
    const endTime = new Date().getTime() + durationInHours * 60 * 60 * 1000;
    localStorage.setItem(timerId, endTime.toString());
    this.challengeCompleted[timerId] = false; // Reset the completion status
    this.updateTimeLeft(timerId);
  }

  stopTimer(timerId: string): void {
    clearInterval(this.timerIntervals[timerId]);
    localStorage.removeItem(timerId);
    this.timers[timerId] = '';
    this.challengeCompleted[timerId] = false;
    delete this.timerIntervals[timerId]; // Clean up the interval reference
  }

  timerRunning(timerId: string): boolean {
    return !!localStorage.getItem(timerId);
  }

  updateTimeLeft(timerId: string): void {
    if (this.timerIntervals[timerId]) {
      clearInterval(this.timerIntervals[timerId]);
    }

    const updateTime = () => {
      const endTime = parseInt(localStorage.getItem(timerId) || '0');
      const currentTime = new Date().getTime();
      const timeLeft = endTime - currentTime;
      if (timeLeft <= 0) {
        clearInterval(this.timerIntervals[timerId]);
        localStorage.removeItem(timerId);
        this.timers[timerId] = '';
        this.challengeCompleted[timerId] = true;
      } else {
        this.timers[timerId] = this.formatTimeLeft(timeLeft);
      }
    };

    updateTime(); // Update immediately, then start interval
    this.timerIntervals[timerId] = setInterval(updateTime, 1000);
  }

  checkTimers(): void {
    // Dynamically check your timers here based on application needs
    const timerIds = ['AL1', 'AL2', 'AL3', 'AL4'];
    timerIds.forEach(timerId => {
      if (this.timerRunning(timerId)) {
        this.updateTimeLeft(timerId);
      } else {
        // If the timer is not found in localStorage, it might have been stopped or never started
        this.challengeCompleted[timerId] = !localStorage.getItem(timerId);
      }
    });
  }

  private formatTimeLeft(timeLeft: number): string {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
