import { Component, OnInit } from '@angular/core';
import { CoffeeStartComponent } from '../coffee-start/coffee-start.component';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-all-challenges',
  templateUrl: './all-challenges.component.html',
  styleUrls: ['./all-challenges.component.scss'],
})
export class AllChallengesComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('vendor/jquery/jquery.slim.js'))
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

  redirectToCoffee() {
    this.router.navigate(['/All-Challenges']);
  }
}
