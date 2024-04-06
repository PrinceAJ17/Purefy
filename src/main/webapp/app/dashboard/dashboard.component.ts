import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NewMoodPickerService, PartialUpdateNewMoodPicker } from '../entities/new-mood-picker/service/new-mood-picker.service';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { INewMoodPicker, NewNewMoodPicker } from '../entities/new-mood-picker/new-mood-picker.model';
import { INavigationPortal } from '../entities/navigation-portal/navigation-portal.model';

import { AccountService } from '../core/auth/account.service';
import { finalize } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<INewMoodPicker>;
export type EntityArrayResponseType = HttpResponse<INewMoodPicker[]>;

@Component({
  selector: 'jhi-dashboard',
  standalone: true,
  imports: [CommonModule],
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

  testval = 'Start';

  testval2?: string | null;

  testval3?: string | null;

  testval4?: string | null;

  testval5?: string | null;

  firstName?: string | null = '';

  moodData?: INewMoodPicker[] | null;

  userMoodData?: INewMoodPicker | null;

  tempIntf?: NewNewMoodPicker;

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

  /*testMethod(): Observable<EntityArrayResponseType>{
    return this.moodpickerService.query(this.moodpickerService.find(1));
  }

  private loadAndPopulateLeaderboard(): void {

    this.accountService.identity().subscribe(
      account => {
        if (account !== null) {
          const username = account.login; // Assuming the user ID is stored in 'id' property
          this.moodpickerService.find().subscribe(
            res => {
              this.histories = res.body || [];
            },
            error => {
              console.error('Error fetching history:', error);
            }
          );
        } else {
          console.error('User account not found.');
        }
      },
      error => {
        console.error('Error fetching user account:', error);
      }
    );
  }*/

  private populateMood(): void {
    /*
    const userId = 1; // Example group ID
    const url = `http://localhost:8080/api/new-mood-pickers/${userId}`;

    this.http.get<BackendMoodEntry[]>(url).subscribe({
      next: (data) => {
        this.moodDataold = data.map(entry => ({
          username: entry.username,
          mood: entry.mood
        }));

        /*this.loadScript('assets/js/Leaderboard.js').then(() => {
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
        console.error('Error fetching mood data:', error);
      },
      complete: () => {
        console.log('Completed fetching mood data');
      }
    });

    */
    //this.moodDataold = this.moodpickerService.find(1)
    /*this.moodpickerService.find(1).subscribe(
      (response) => { this.moodDataold = response.body?.username;
      console.log(response.body?.username)});

    this.testval = 'Done';

    this.moodpickerService.query().subscribe(
      (response) => { this.moodData2 = response.body;
        if (this.moodData2){
          console.log(this.moodData2[0].mood);
          this.testval2 = this.moodData2[0].mood;
        }
        console.log(response.body)});*/
    //console.log(this.moodData2[0])
    //this.testval2 = this.moodDataold?.username
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

              this.testval4 = this.userMoodData.username;
              this.testval5 = this.userMoodData.mood;
            } else {
              //create new newMoodPicker

              this.tempIntf = {
                id: null,
                username: username,
                mood: 'None',
              };

              console.log('User mood not found, creating new newMoodPicker...');

              this.moodpickerService.create(this.tempIntf).subscribe(newMood => {
                this.userMoodData = newMood.body;

                if (this.userMoodData) {
                  this.testval4 = this.userMoodData.username;
                  this.testval5 = this.userMoodData.mood;
                }
                console.log('Created new newMoodPicker successfully:', this.userMoodData);
              });

              this.currentView = 'None';
              this.chosenMood = 'None';
            }

            console.log(this.moodData[0].username);
            console.log(this.moodData[0].mood);

            this.testval2 = this.moodData[0].username;
            this.testval3 = this.moodData[0].mood;
          }
          console.log(response.body);
        });
      } else {
        console.error('User account not found.');
      }
    });

    this.testval = 'Done';

    //if user is not logged in, defaults to start point of moodpicker
    if (!this.loggedin) {
      this.loggedin = 'false';
      this.currentView = 'None';
      this.chosenMood = 'None';
    }
  }

  //chosenMood = this.moodDataold[1].mood;
}
