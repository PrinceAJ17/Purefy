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

  // You can add methods to change the currentState here, if necessary

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
}
