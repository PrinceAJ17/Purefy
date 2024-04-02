import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { ProfilepageComponent } from '../profilepage/profilepage.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: ProfilepageComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
