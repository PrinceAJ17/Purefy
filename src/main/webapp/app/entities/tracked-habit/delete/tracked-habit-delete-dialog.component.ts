import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrackedHabit } from '../tracked-habit.model';
import { TrackedHabitService } from '../service/tracked-habit.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './tracked-habit-delete-dialog.component.html',
})
export class TrackedHabitDeleteDialogComponent {
  trackedHabit?: ITrackedHabit;

  constructor(protected trackedHabitService: TrackedHabitService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trackedHabitService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
