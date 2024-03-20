import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { HabitTrackerComponent } from '../habit-tracker/habit-tracker.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HabitTrackerComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
