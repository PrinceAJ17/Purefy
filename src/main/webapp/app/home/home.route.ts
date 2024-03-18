import { Route } from '@angular/router';
import { ProfilepageComponent } from '../profilepage/profilepage.component';
import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: ProfilepageComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
