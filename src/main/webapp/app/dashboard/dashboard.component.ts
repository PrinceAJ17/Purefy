import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NewMoodPickerService, PartialUpdateNewMoodPicker } from '../entities/new-mood-picker/service/new-mood-picker.service';
import { PointsService } from '../entities/points/service/points.service';
import { HabitstrackingService } from '../entities/habitstracking/service/habitstracking.service';
import { UserService } from '../entities/user/user.service';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { INewMoodPicker, NewNewMoodPicker } from '../entities/new-mood-picker/new-mood-picker.model';
import { IPoints } from '../entities/points/points.model';
import { IUserPoints } from '../entities/user-points/user-points.model';
import { IHabitstracking } from '../entities/habitstracking/habitstracking.model';
import { IUser, getUserIdentifier } from '../entities/user/user.model';

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
    private accountService: AccountService,
    private pointsService: PointsService,
    private habittrackingService: HabitstrackingService,
    private userService: UserService
  ) {}

  loggedin?: string;

  currentView?: string;

  chosenMood: string | null | undefined;

  firstName?: string | null = '';

  userID?: number;

  moodData?: INewMoodPicker[] | null;

  userMoodData?: INewMoodPicker | null;

  tempMoodPicker?: NewNewMoodPicker;

  pointsData?: IUserPoints[] | null;

  userPointsData?: IUserPoints | null;

  userCurrentPoints?: number | null | undefined;

  HTData?: IHabitstracking[] | null;

  userHTData?: IHabitstracking | null;

  userHabits: number[] = [0, 0];

  habitsfound?: string;

  week?: number;

  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

    this.week = this.getCurrentWeekNumber();
    this.loadMoodandProgress();
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

  getCurrentWeekNumber(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.valueOf() - startOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }

  getCurrentDay(): string {
    const now = new Date();
    return this.daysOfWeek[now.getDay()];
  }

  loadMoodandProgress(): void {
    this.accountService.identity().subscribe(account => {
      if (account !== null) {
        this.loggedin = 'true';
        this.firstName = account.firstName;
        const username = account.login;
        console.log(username);

        //gets user ID of logged-in user
        this.userService.query().subscribe(users => {
          if (users.body) {
            let result = users.body.find(user => user.login === username);

            if (result) {
              this.userID = result.id;
            } else {
              this.userID = 0;
            }
          }
          console.log('Request ran:', users.body);

          console.log(this.userID);

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

          this.pointsService.query().subscribe(response => {
            this.pointsData = response.body;
            if (this.pointsData) {
              let result = this.pointsData.find(item => item.userID === this.userID);

              if (result) {
                this.userPointsData = result;

                this.userCurrentPoints = this.userPointsData.currentPoints;
              } else {
                //create new newMoodPicker

                this.userCurrentPoints = 0;
              }
            }
            console.log(this.pointsData);
            console.log(this.userPointsData);
            console.log(response.body);
          });

          this.habittrackingService.query().subscribe(response => {
            this.HTData = response.body;
            if (this.HTData) {
              let result = this.HTData.filter(
                item =>
                  item['usernameHabit'] === username && item['weekOfHabit'] === this.week && item['dayOfHabit'] === this.getCurrentDay()
              );

              console.log(result);

              if (result.length !== 0) {
                this.habitsfound = 'true';

                this.userHabits[1] = result.length;

                this.userHabits[0] = result.filter(item => item['completedHabit'] === true).length;
              } else {
                //create new newMoodPicker

                this.habitsfound = 'false';
              }
            }
            console.log(response.body);

            console.log(this.userHabits);
          });
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

    if (!this.habitsfound) {
      this.habitsfound = 'false';
    }
  }
  goToPromptsPage(): void {
    this.router.navigate(['/Prompts']);
  }
}
