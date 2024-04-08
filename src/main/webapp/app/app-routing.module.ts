import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SupportComponent } from './support/support.component';
import { TeamComponent } from './team/team.component';
import { AboutComponent } from './about/about.component';
import { SignoutComponent } from './signout/signout.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetFinishComponent } from './account/password-reset/finish/password-reset-finish.component';

const routes: Routes = [
  {
    path: 'About',
    component: AboutComponent,
  },
  {
    path: 'Team',
    component: TeamComponent,
  },
  {
    path: 'Password',
    component: PasswordResetFinishComponent,
  },
  {
    path: 'Login',
    component: LoginComponent,
  },
  {
    path: 'Profilepage',
    component: ProfilepageComponent,
  },
  {
    path: 'Signout',
    component: SignoutComponent,
  },
  {
    path: 'Feedback',
    component: FeedbackComponent,
  },
  {
    path: 'Support',
    component: SupportComponent,
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
          path: 'Password',
          component: PasswordResetFinishComponent,
        },
        {
          path: 'Login',
          component: LoginComponent,
        },
        {
          path: 'Team',
          component: TeamComponent,
        },
        {
          path: 'Profilepage',
          component: ProfilepageComponent,
        },

        {
          path: 'Feedback',
          component: FeedbackComponent,
        },
        {
          path: 'Support',
          component: SupportComponent,
        },
        {
          path: 'About',
          component: AboutComponent,
        },
        {
          path: 'Signout',
          component: SignoutComponent,
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
