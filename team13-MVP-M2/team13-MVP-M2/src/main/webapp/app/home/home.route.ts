import { Route } from '@angular/router';
import {HabitsComponent} from "../habits/habits.component";

export const HOME_ROUTE: Route = {
  path: '',
  component: HabitsComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
