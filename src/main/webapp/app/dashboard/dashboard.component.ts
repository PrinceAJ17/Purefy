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

  emotionView = 'None';

  chosenMood = 'None';

  //HAPPY = ['Motivated','Content','Optimistic'];

  //NEUTRAL = ['Bored','Tempted','Unmotivated'];

  //SAD = ['Irritable','Anxious','Tired'];

  TIPSINDEX = [
    { Em: 'Motivated', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Content', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Optimistic', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Bored', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Tempted', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Unmotivated', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Irritable', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Anxious', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Em: 'Tired', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
  ];

  MOODINDEX = [
    { Md: 'Happy', Em: ['Motivated', 'Content', 'Optimistic'] },
    { Md: 'Neutral', Em: ['Bored', 'Tempted', 'Unmotivated'] },
    { Md: 'Sad', Em: ['Irritable', 'Anxious', 'Tired'] },
  ];

  //ALLEMOTIONS = this.HAPPY.concat(this.NEUTRAL.concat(this.SAD));

  //emotionCheck = (this.emotionView in this.ALLEMOTIONS);

  switchView(emotion: string): void {
    if (this.TIPSINDEX.some(obj => Object.values(obj)[0] === emotion)) {
      this.emotionView = 'MoodChosen';
      this.chosenMood = emotion;
    } else {
      this.emotionView = emotion;
      if (emotion == 'Redo') {
        this.chosenMood = 'None';
        this.emotionView = 'None';
      }
    }
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
