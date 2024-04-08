import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { HabitComponent } from '../habit/habit.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HabitComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
