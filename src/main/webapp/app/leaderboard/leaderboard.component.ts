import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  
})
export class LeaderboardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadScript('assets/js/Leaderboard.js'))
      .then(() => {
        console.log('All scripts loaded successfully');

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

}


