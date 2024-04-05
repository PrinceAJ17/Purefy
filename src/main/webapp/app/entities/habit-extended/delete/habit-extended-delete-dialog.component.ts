import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHabitExtended } from '../habit-extended.model';
import { HabitExtendedService } from '../service/habit-extended.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './habit-extended-delete-dialog.component.html',
})
export class HabitExtendedDeleteDialogComponent {
  habitExtended?: IHabitExtended;

  constructor(protected habitExtendedService: HabitExtendedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.habitExtendedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
