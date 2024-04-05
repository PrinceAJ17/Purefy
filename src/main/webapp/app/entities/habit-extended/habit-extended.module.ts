import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HabitExtendedComponent } from './list/habit-extended.component';
import { HabitExtendedDetailComponent } from './detail/habit-extended-detail.component';
import { HabitExtendedUpdateComponent } from './update/habit-extended-update.component';
import { HabitExtendedDeleteDialogComponent } from './delete/habit-extended-delete-dialog.component';
import { HabitExtendedRoutingModule } from './route/habit-extended-routing.module';

@NgModule({
  imports: [SharedModule, HabitExtendedRoutingModule],
  declarations: [HabitExtendedComponent, HabitExtendedDetailComponent, HabitExtendedUpdateComponent, HabitExtendedDeleteDialogComponent],
})
export class HabitExtendedModule {}
