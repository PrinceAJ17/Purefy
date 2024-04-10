import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  data: {
    pageTitle: 'Dashboard',
  },
};
