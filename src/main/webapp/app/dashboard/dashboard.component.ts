import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NewMoodPickerService, PartialUpdateNewMoodPicker } from '../entities/new-mood-picker/service/new-mood-picker.service';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { INewMoodPicker, NewNewMoodPicker } from '../entities/new-mood-picker/new-mood-picker.model';

import { AccountService } from '../core/auth/account.service';
import { finalize } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<INewMoodPicker>;
export type EntityArrayResponseType = HttpResponse<INewMoodPicker[]>;

@Component({
  selector: 'jhi-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private moodpickerService: NewMoodPickerService,
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  loggedin?: string;

  currentView?: string;

  chosenMood: string | null | undefined;

  firstName?: string | null = '';

  moodData?: INewMoodPicker[] | null;

  userMoodData?: INewMoodPicker | null;

  tempMoodPicker?: NewNewMoodPicker;

  TIPSINDEX = [
    {
      Md: 'Content',
      tips: [
        'Try setting aside 10 minutes for meditation',
        "Make sure to stand up and walk around if you're sat for long periods of time",
        'Remember to stay hydrated!',
      ],
    },
    { Md: 'Motivated', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Optimistic', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Bored', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Distracted', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Unmotivated', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Irritable', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Anxious', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
    { Md: 'Tired', tips: ['Tip 1', 'Tip 2', 'Tip 3'] },
  ];

  MOODINDEX = [
    { Em: 'Happy', Md: ['Content', 'Motivated', 'Optimistic'] },
    { Em: 'Neutral', Md: ['Bored', 'Distracted', 'Unmotivated'] },
    { Em: 'Sad', Md: ['Irritable', 'Anxious', 'Tired'] },
  ];

  switchView(view: string, mood: string | null | undefined = 'None'): void {
    this.currentView = view;
    if (this.chosenMood != mood) {
      this.chosenMood = mood;

      if (this.userMoodData) {
        let tempMood: PartialUpdateNewMoodPicker = {
          id: this.userMoodData.id,
          mood: mood,
        };

        this.moodpickerService.partialUpdate(tempMood).subscribe(newMood => {
          console.log('Updated newMoodPicker successfully:', newMood.body);
        });

        this.userMoodData.mood = mood;
      }
    }
  }

  ngOnInit(): void {
    this.loadScript('vendor/jquery/jquery.min.js')
      .then(() => this.loadMood())
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

  loadMood(): void {
    this.accountService.identity().subscribe(account => {
      if (account !== null) {
        this.loggedin = 'true';
        this.firstName = account.firstName;
        const username = account.login; // Assuming the user ID is stored in 'id' property
        console.log(username);
        this.moodpickerService.query().subscribe(response => {
          this.moodData = response.body;
          if (this.moodData) {
            let result = this.moodData.find(item => item.username === username);

            if (result) {
              if (result.mood == 'None') {
                this.currentView = 'None';
                this.chosenMood = 'None';
              } else {
                this.currentView = 'MoodChosen';
                this.chosenMood = result.mood;
              }

              this.userMoodData = result;
            } else {
              //create new newMoodPicker

              this.tempMoodPicker = {
                id: null,
                username: username,
                mood: 'None',
              };

              console.log('User mood not found, creating new newMoodPicker...');

              this.moodpickerService.create(this.tempMoodPicker).subscribe(newMood => {
                this.userMoodData = newMood.body;

                console.log('Created new newMoodPicker successfully:', this.userMoodData);
              });

              this.currentView = 'None';
              this.chosenMood = 'None';
            }

            console.log(this.moodData[0].username);
            console.log(this.moodData[0].mood);
          }
          console.log(response.body);
        });
      } else {
        console.error('User account not found.');
      }
    });

    //if user is not logged in, defaults to start point of moodpicker
    if (!this.loggedin) {
      this.loggedin = 'false';
      this.currentView = 'None';
      this.chosenMood = 'None';
    }
  }
  goToPromptsPage(): void {
    this.router.navigate(['/Prompts']);
  }
}
