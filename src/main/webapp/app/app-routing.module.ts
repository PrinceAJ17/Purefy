import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AlcoholStartComponent } from './alcohol-start/alcohol-start.component';
import { HistoryComponent } from './history/history.component';
import { FoodStartComponent } from './food-start/food-start.component';
import { GamesStartComponent } from './games-start/games-start.component';
import { MusicStartComponent } from './music-start/music-start.component';
import { SmokingStartComponent } from './smoking-start/smoking-start.component';
import { SocialStartComponent } from './social-start/social-start.component';
import { VideoStartComponent } from './video-start/video-start.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MoodJournalPageComponent } from './mood-journal-page/mood-journal-page.component';
import { EntriesComponent } from './entries/entries.component';
import { PromptsComponent } from './prompts/prompts.component';
import { EmotionsComponent } from './emotions/emotions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SupportComponent } from './support/support.component';
import { TeamComponent } from './team/team.component';
import { AboutComponent } from './about/about.component';
import { SignoutComponent } from './signout/signout.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetFinishComponent } from './account/password-reset/finish/password-reset-finish.component';
import { AllChallengesComponent } from './all-challenges/all-challenges.component';
import { CoffeeLevelsComponent } from './coffee-levels/coffee-levels.component';
import { MusicLevelsComponent } from './music-levels/music-levels.component';
import { VideoLevelsComponent } from './video-levels/video-levels.component';
import { SociaLevelsComponent } from './socia-levels/socia-levels.component';
import { SmokingLevelsComponent } from './smoking-levels/smoking-levels.component';
import { FoodLevelsComponent } from './food-levels/food-levels.component';
import { AlcoholLevelsComponent } from './alcohol-levels/alcohol-levels.component';
import { GamesLevelsComponent } from './games-levels/games-levels.component';
import { CoffeeStartComponent } from './coffee-start/coffee-start.component';
import { ChallengesIndexComponent } from './challenges-index/challenges-index.component';

const routes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'Challenges',
    component: ChallengesIndexComponent,
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
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
  },
  {
    path: 'MoodJournalPage',
    component: MoodJournalPageComponent,
  },
  {
    path: 'Entries',
    component: EntriesComponent,
  },
  {
    path: 'Prompts',
    component: PromptsComponent,
  },
  {
    path: 'Emotions',
    component: EmotionsComponent,
  },
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
          path: 'Challenges',
          component: ChallengesIndexComponent,
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
        {
          path: 'leaderboard',
          component: LeaderboardComponent,
        },
        {
          path: 'MoodJournalPage',
          component: MoodJournalPageComponent,
        },
        {
          path: 'Entries',
          component: EntriesComponent,
        },
        {
          path: 'Prompts',
          component: PromptsComponent,
        },
        {
          path: 'Emotions',
          component: EmotionsComponent,
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
          path: 'Coffee-Start/:state',
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
