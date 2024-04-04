import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { LoginComponent } from '../login/login.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: LoginComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
