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

  timers: { [id: string]: { running: boolean; timeLeft: string } } = {};

  startTimerFromHTML(timerId: string, duration: number) {
    const endTime = new Date().getTime() + duration;
    localStorage.setItem(`${timerId}-endTime`, endTime.toString());

    if (!this.timers[timerId]) {
      this.timers[timerId] = { running: true, timeLeft: '' };
    }

    this.updateTimeLeft(timerId);
  }

  updateTimeLeft(timerId: string) {
    const interval = setInterval(() => {
      const endTime = parseInt(localStorage.getItem(`${timerId}-endTime`) || '0', 10);
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        this.timers[timerId].running = false;
        this.timers[timerId].timeLeft = 'Expired';
        return;
      }

      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      this.timers[timerId].timeLeft = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
}
