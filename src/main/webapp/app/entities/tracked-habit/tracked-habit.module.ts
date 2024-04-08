import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrackedHabitComponent } from './list/tracked-habit.component';
import { TrackedHabitDetailComponent } from './detail/tracked-habit-detail.component';
import { TrackedHabitUpdateComponent } from './update/tracked-habit-update.component';
import { TrackedHabitDeleteDialogComponent } from './delete/tracked-habit-delete-dialog.component';
import { TrackedHabitRoutingModule } from './route/tracked-habit-routing.module';

@NgModule({
  imports: [SharedModule, TrackedHabitRoutingModule],
  declarations: [TrackedHabitComponent, TrackedHabitDetailComponent, TrackedHabitUpdateComponent, TrackedHabitDeleteDialogComponent],
})
export class TrackedHabitModule {}
