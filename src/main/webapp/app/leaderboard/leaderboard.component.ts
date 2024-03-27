import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';

interface BackendLeaderboardEntry {
  username: string;
  currentPoints: number;
  previousPoints: number;
  totalPoints: number;
}

interface LeaderboardEntry {
  name: string;
  current: number;
  previous: number;
  total: number;
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
  ]

  constructor(private http: HttpClient, private router: Router) {}

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

  private loadAndPopulateLeaderboard(): void {

    const groupId = 1; // Example group ID
    const url = `http://localhost:8080/api/members/group/${groupId}/points`;

    this.http.get<BackendLeaderboardEntry[]>(url).subscribe({
      next: (data) => {
        this.leaderboardData = data.map(entry => ({
          name: entry.username,
          current: entry.currentPoints,
          previous: entry.previousPoints,
          total:  entry.totalPoints,
        }));

        this.loadScript('assets/js/Leaderboard.js').then(() => {
          if (window.leaderboardFunctions) {
            window.leaderboardFunctions.populateLeaderboard(this.leaderboardData);
            window.leaderboardFunctions.populatePreviousLeaderboard(this.leaderboardData);
            window.leaderboardFunctions.populateOverallLeaderboard(this.leaderboardData);
            window.leaderboardFunctions.populateYourGroup(this.leaderboardData);
          } else {
            console.error('Leaderboard functions not available.');
          }
        }).catch(error => console.error('Error loading Leaderboard.js:', error));
  
      },
      error: (error) => {
        console.error('Error fetching leaderboard data:', error);
      },
      complete: () => {
        console.log('Completed fetching leaderboard data');
      }
    });
  }
}
