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
import { SociaLevelsComponent } from './socia-levels/socia-levels.component';
import { FoodLevelsComponent } from './food-levels/food-levels.component';
import { AlcoholLevelsComponent } from './alcohol-levels/alcohol-levels.component';
import { SmokingLevelsComponent } from './smoking-levels/smoking-levels.component';
import { MusicLevelsComponent } from './music-levels/music-levels.component';
import { GamesLevelsComponent } from './games-levels/games-levels.component';
import { VideoLevelsComponent } from './video-levels/video-levels.component';
import { AlcoholStartComponent } from './alcohol-start/alcohol-start.component';
import { HistoryComponent } from './history/history.component';
import { FoodStartComponent } from './food-start/food-start.component';
import { GamesStartComponent } from './games-start/games-start.component';
import { MusicStartComponent } from './music-start/music-start.component';
import { SmokingStartComponent } from './smoking-start/smoking-start.component';
import { SocialStartComponent } from './social-start/social-start.component';
import { VideoStartComponent } from './video-start/video-start.component';

const routes: Routes = [
  {
    path: 'All-Challenges',
    component: AllChallengesComponent,
  },
  {
    path: 'Music',
    component: MusicLevelsComponent,
  },
  {
    path: 'Video',
    component: VideoLevelsComponent,
  },
  {
    path: 'Social',
    component: SociaLevelsComponent,
  },
  {
    path: 'Smoking',
    component: SmokingLevelsComponent,
  },
  {
    path: 'JunkFood',
    component: FoodLevelsComponent,
  },
  {
    path: 'Alcohol',
    component: AlcoholLevelsComponent,
  },
  {
    path: 'VideoGames',
    component: GamesLevelsComponent,
  },
  {
    path: 'Coffee',
    component: CoffeeLevelsComponent,
  },
  {
    path: 'Coffee-Start/:state',
    component: CoffeeStartComponent,
  },
  {
    path: 'Alcohol-Start/:state',
    component: AlcoholStartComponent,
  },
  {
    path: 'History',
    component: HistoryComponent,
  },
  {
    path: 'Food-Start/:state',
    component: FoodStartComponent,
  },
  {
    path: 'Games-Start/:state',
    component: GamesStartComponent,
  },
  {
    path: 'Music-Start/:state',
    component: MusicStartComponent,
  },
  {
    path: 'Smoking-Start/:state',
    component: SmokingStartComponent,
  },
  {
    path: 'Social-Start/:state',
    component: SocialStartComponent,
  },
  {
    path: 'Videos-Start/:state',
    component: VideoStartComponent,
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
          path: 'All-Challenges',
          component: AllChallengesComponent,
        },
        {
          path: 'Coffee',
          component: CoffeeLevelsComponent,
        },
        {
          path: 'Coffee-Start/:state',
          component: CoffeeStartComponent,
        },
        {
          path: 'Music',
          component: MusicLevelsComponent,
        },
        {
          path: 'Video',
          component: VideoLevelsComponent,
        },
        {
          path: 'Social',
          component: SociaLevelsComponent,
        },
        {
          path: 'Smoking',
          component: SmokingLevelsComponent,
        },
        {
          path: 'JunkFood',
          component: FoodLevelsComponent,
        },
        {
          path: 'Alcohol',
          component: AlcoholLevelsComponent,
        },
        {
          path: 'VideoGames',
          component: GamesLevelsComponent,
        },
        {
          path: 'Alcohol-Start/:state',
          component: AlcoholStartComponent,
        },
        {
          path: 'History',
          component: HistoryComponent,
        },
        {
          path: 'Food-Start/:state',
          component: FoodStartComponent,
        },
        {
          path: 'Games-Start/:state',
          component: GamesStartComponent,
        },
        {
          path: 'Music-Start/:state',
          component: MusicStartComponent,
        },
        {
          path: 'Smoking-Start/:state',
          component: SmokingStartComponent,
        },
        {
          path: 'Social-Start/:state',
          component: SocialStartComponent,
        },
        {
          path: 'Videos-Start/:state',
          component: VideoStartComponent,
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
