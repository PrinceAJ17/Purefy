import { Route } from '@angular/router';
import { ChallengesIndexComponent } from '../challenges-index/challenges-index.component';
import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: ChallengesIndexComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
