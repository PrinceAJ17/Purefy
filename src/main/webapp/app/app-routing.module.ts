import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChallengesIndexComponent } from './challenges-index/challenges-index.component';
import { AllChallengesComponent } from './all-challenges/all-challenges.component';
import { CoffeeLevelsComponent } from './coffee-levels/coffee-levels.component';
import { CoffeeStartComponent } from './coffee-start/coffee-start.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'All-Challenges',
    component: AllChallengesComponent,
  },
  {
    path: 'Coffee',
    component: CoffeeLevelsComponent,
  },
  {
    path: 'Coffee-Start',
    component: CoffeeStartComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'Dashboard',
          component: DashboardComponent,
        },
        {
          path: 'All-Challenges',
          component: AllChallengesComponent,
        },
        {
          path: 'Coffee',
          component: CoffeeLevelsComponent,
        },
        {
          path: 'Coffee-Start',
          component: CoffeeStartComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
