import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HabitExtendedComponent } from '../list/habit-extended.component';
import { HabitExtendedDetailComponent } from '../detail/habit-extended-detail.component';
import { HabitExtendedUpdateComponent } from '../update/habit-extended-update.component';
import { HabitExtendedRoutingResolveService } from './habit-extended-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const habitExtendedRoute: Routes = [
  {
    path: '',
    component: HabitExtendedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HabitExtendedDetailComponent,
    resolve: {
      habitExtended: HabitExtendedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HabitExtendedUpdateComponent,
    resolve: {
      habitExtended: HabitExtendedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HabitExtendedUpdateComponent,
    resolve: {
      habitExtended: HabitExtendedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(habitExtendedRoute)],
  exports: [RouterModule],
})
export class HabitExtendedRoutingModule {}
