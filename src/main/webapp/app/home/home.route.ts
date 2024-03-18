import { Route } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: SettingsComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
