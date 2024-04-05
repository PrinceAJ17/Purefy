import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HabitExtendedFormService, HabitExtendedFormGroup } from './habit-extended-form.service';
import { IHabitExtended } from '../habit-extended.model';
import { HabitExtendedService } from '../service/habit-extended.service';
import { INewWeeklyHabitTracker } from 'app/entities/new-weekly-habit-tracker/new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from 'app/entities/new-weekly-habit-tracker/service/new-weekly-habit-tracker.service';

@Component({
  selector: 'jhi-habit-extended-update',
  templateUrl: './habit-extended-update.component.html',
})
export class HabitExtendedUpdateComponent implements OnInit {
  isSaving = false;
  habitExtended: IHabitExtended | null = null;

  newWeeklyHabitTrackersSharedCollection: INewWeeklyHabitTracker[] = [];

  editForm: HabitExtendedFormGroup = this.habitExtendedFormService.createHabitExtendedFormGroup();

  constructor(
    protected habitExtendedService: HabitExtendedService,
    protected habitExtendedFormService: HabitExtendedFormService,
    protected newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareNewWeeklyHabitTracker = (o1: INewWeeklyHabitTracker | null, o2: INewWeeklyHabitTracker | null): boolean =>
    this.newWeeklyHabitTrackerService.compareNewWeeklyHabitTracker(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habitExtended }) => {
      this.habitExtended = habitExtended;
      if (habitExtended) {
        this.updateForm(habitExtended);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const habitExtended = this.habitExtendedFormService.getHabitExtended(this.editForm);
    if (habitExtended.id !== null) {
      this.subscribeToSaveResponse(this.habitExtendedService.update(habitExtended));
    } else {
      this.subscribeToSaveResponse(this.habitExtendedService.create(habitExtended));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHabitExtended>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(habitExtended: IHabitExtended): void {
    this.habitExtended = habitExtended;
    this.habitExtendedFormService.resetForm(this.editForm, habitExtended);

    this.newWeeklyHabitTrackersSharedCollection =
      this.newWeeklyHabitTrackerService.addNewWeeklyHabitTrackerToCollectionIfMissing<INewWeeklyHabitTracker>(
        this.newWeeklyHabitTrackersSharedCollection,
        habitExtended.rel1
      );
  }

  protected loadRelationshipsOptions(): void {
    this.newWeeklyHabitTrackerService
      .query()
      .pipe(map((res: HttpResponse<INewWeeklyHabitTracker[]>) => res.body ?? []))
      .pipe(
        map((newWeeklyHabitTrackers: INewWeeklyHabitTracker[]) =>
          this.newWeeklyHabitTrackerService.addNewWeeklyHabitTrackerToCollectionIfMissing<INewWeeklyHabitTracker>(
            newWeeklyHabitTrackers,
            this.habitExtended?.rel1
          )
        )
      )
      .subscribe(
        (newWeeklyHabitTrackers: INewWeeklyHabitTracker[]) => (this.newWeeklyHabitTrackersSharedCollection = newWeeklyHabitTrackers)
      );
  }
}
