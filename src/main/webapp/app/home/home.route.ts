import { Route } from '@angular/router';
import { ChallengesIndexComponent } from '../challenges-index/challenges-index.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: MoodJournalPageComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
