import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import {ChallengesComponent} from "../entities/challenges/list/challenges.component";

export const HOME_ROUTE: Route = {
  path: '',

  component: HomeComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
