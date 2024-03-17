import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-coffee-start',
  templateUrl: './coffee-start.component.html',
  styleUrls: ['./coffee-start.component.scss'],
})
export class CoffeeStartComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  currentState: string | undefined;

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
    this.checkTimer();
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

  timerRunning = false;
  timeLeft?: string;

  startTimer() {
    const endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem('timerEndTime', endTime.toString());
    this.timerRunning = true;
    this.updateTimeLeft();
  }

  checkTimer() {
    const endTime = parseInt(localStorage.getItem('timerEndTime') || '0', 10);
    if (endTime) {
      this.timerRunning = new Date().getTime() < endTime;
      if (this.timerRunning) {
        this.updateTimeLeft();
      }
    }
  }

  updateTimeLeft() {
    const interval = setInterval(() => {
      const endTime = parseInt(localStorage.getItem('timerEndTime') || '0', 10);
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        this.timeLeft = undefined;
        this.timerRunning = false;
        localStorage.removeItem('timerEndTime'); // Clear timer end time
        return;
      }

      // Time calculations for days, hours, minutes and seconds
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      this.timeLeft = hours + 'h ' + minutes + 'm ' + seconds + 's ';
    }, 1000);
  }
}
