import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrackedHabitComponent } from '../list/tracked-habit.component';
import { TrackedHabitDetailComponent } from '../detail/tracked-habit-detail.component';
import { TrackedHabitUpdateComponent } from '../update/tracked-habit-update.component';
import { TrackedHabitRoutingResolveService } from './tracked-habit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const trackedHabitRoute: Routes = [
  {
    path: '',
    component: TrackedHabitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrackedHabitDetailComponent,
    resolve: {
      trackedHabit: TrackedHabitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrackedHabitUpdateComponent,
    resolve: {
      trackedHabit: TrackedHabitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrackedHabitUpdateComponent,
    resolve: {
      trackedHabit: TrackedHabitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trackedHabitRoute)],
  exports: [RouterModule],
})
export class TrackedHabitRoutingModule {}
