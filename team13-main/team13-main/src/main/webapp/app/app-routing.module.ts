import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LevelsComponent } from './levels/levels.component';
import { BeginnerComponent } from './beginner/beginner.component';
import { PasswordResetFinishComponent } from './account/password-reset/finish/password-reset-finish.component';

const routes: Routes = [
  {
    path: 'levels',
    component: LevelsComponent,
  },
  {
    path: 'Beginner',
    component: BeginnerComponent,
  },
  {
    path: 'Password',
    component: PasswordResetFinishComponent,
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
          path: 'levels',
          component: LevelsComponent,
        },
        {
          path: 'beginner',
          component: BeginnerComponent,
        },
        {
          path: 'Password',
          component: PasswordResetFinishComponent,
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
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
