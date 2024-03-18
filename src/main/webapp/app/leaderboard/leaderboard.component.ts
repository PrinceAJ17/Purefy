import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface LeaderboardEntry {
  name: string;
  score: number;
}

declare global {
  interface Window {
    leaderboardFunctions: any;
  }
}

@Component({
  selector: 'jhi-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  leaderboardData: LeaderboardEntry[] = [
    { name: 'Sam', score: 13 },
    { name: 'Allen', score: 11 },
    { name: 'Asa', score: 10 },
    { name: 'Ankita', score: 9 },
    { name: 'Adnaan', score: 8 },
    { name: 'Prince', score: 7 },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('vendor/bootstrap/js/bootstrap.min.js'))
      .then(() => this.loadAndPopulateLeaderboard())
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

  private loadAndPopulateLeaderboard(): Promise<void> {
    return this.loadScript('assets/js/Leaderboard.js')
      .then(() => {
        if (window.leaderboardFunctions) {
          window.leaderboardFunctions.populateLeaderboard(this.leaderboardData);
        } else {
          console.error('leaderboardFunctions is not defined');
        }
      })
      .catch(error => console.error('Script loading error:', error));
  }
}
