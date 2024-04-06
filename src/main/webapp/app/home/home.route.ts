import { Route } from '@angular/router';
import { ChallengesIndexComponent } from '../challenges-index/challenges-index.component';
import { HomeComponent } from './home.component';
import { MoodJournalPageComponent } from '../mood-journal-page/mood-journal-page.component';

import { HabitTrackerComponent } from '../habit-tracker/habit-tracker.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HabitTrackerComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
