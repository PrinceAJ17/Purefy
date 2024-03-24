import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  currentView = 'None';

  chosenMood = 'None';

  TIPSINDEX = [
    { Md: 'Motivated', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Content', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Optimistic', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Bored', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Tempted', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Unmotivated', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Irritable', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Anxious', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Tired', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
  ];

  MOODINDEX = [
    { Em: 'Happy', Md: ['Motivated', 'Content', 'Optimistic'] },
    { Em: 'Neutral', Md: ['Bored', 'Tempted', 'Unmotivated'] },
    { Em: 'Sad', Md: ['Irritable', 'Anxious', 'Tired'] },
  ];

  switchView(view: string, mood: string = 'None'): void {
    this.currentView = view;
    this.chosenMood = mood;
  }

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
