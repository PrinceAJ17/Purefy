import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TrackedHabitFormService, TrackedHabitFormGroup } from './tracked-habit-form.service';
import { ITrackedHabit } from '../tracked-habit.model';
import { TrackedHabitService } from '../service/tracked-habit.service';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';
import { INewWeeklyHabitTracker } from 'app/entities/new-weekly-habit-tracker/new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from 'app/entities/new-weekly-habit-tracker/service/new-weekly-habit-tracker.service';

@Component({
  selector: 'jhi-tracked-habit-update',
  templateUrl: './tracked-habit-update.component.html',
})
export class TrackedHabitUpdateComponent implements OnInit {
  isSaving = false;
  trackedHabit: ITrackedHabit | null = null;

  habitsSharedCollection: IHabit[] = [];
  newWeeklyHabitTrackersSharedCollection: INewWeeklyHabitTracker[] = [];

  editForm: TrackedHabitFormGroup = this.trackedHabitFormService.createTrackedHabitFormGroup();

  constructor(
    protected trackedHabitService: TrackedHabitService,
    protected trackedHabitFormService: TrackedHabitFormService,
    protected habitService: HabitService,
    protected newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHabit = (o1: IHabit | null, o2: IHabit | null): boolean => this.habitService.compareHabit(o1, o2);

  compareNewWeeklyHabitTracker = (o1: INewWeeklyHabitTracker | null, o2: INewWeeklyHabitTracker | null): boolean =>
    this.newWeeklyHabitTrackerService.compareNewWeeklyHabitTracker(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trackedHabit }) => {
      this.trackedHabit = trackedHabit;
      if (trackedHabit) {
        this.updateForm(trackedHabit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trackedHabit = this.trackedHabitFormService.getTrackedHabit(this.editForm);
    if (trackedHabit.id !== null) {
      this.subscribeToSaveResponse(this.trackedHabitService.update(trackedHabit));
    } else {
      this.subscribeToSaveResponse(this.trackedHabitService.create(trackedHabit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrackedHabit>>): void {
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

  protected updateForm(trackedHabit: ITrackedHabit): void {
    this.trackedHabit = trackedHabit;
    this.trackedHabitFormService.resetForm(this.editForm, trackedHabit);

    this.habitsSharedCollection = this.habitService.addHabitToCollectionIfMissing<IHabit>(this.habitsSharedCollection, trackedHabit.rel1);
    this.newWeeklyHabitTrackersSharedCollection =
      this.newWeeklyHabitTrackerService.addNewWeeklyHabitTrackerToCollectionIfMissing<INewWeeklyHabitTracker>(
        this.newWeeklyHabitTrackersSharedCollection,
        trackedHabit.rel2
      );
  }

  protected loadRelationshipsOptions(): void {
    this.habitService
      .query()
      .pipe(map((res: HttpResponse<IHabit[]>) => res.body ?? []))
      .pipe(map((habits: IHabit[]) => this.habitService.addHabitToCollectionIfMissing<IHabit>(habits, this.trackedHabit?.rel1)))
      .subscribe((habits: IHabit[]) => (this.habitsSharedCollection = habits));

    this.newWeeklyHabitTrackerService
      .query()
      .pipe(map((res: HttpResponse<INewWeeklyHabitTracker[]>) => res.body ?? []))
      .pipe(
        map((newWeeklyHabitTrackers: INewWeeklyHabitTracker[]) =>
          this.newWeeklyHabitTrackerService.addNewWeeklyHabitTrackerToCollectionIfMissing<INewWeeklyHabitTracker>(
            newWeeklyHabitTrackers,
            this.trackedHabit?.rel2
          )
        )
      )
      .subscribe(
        (newWeeklyHabitTrackers: INewWeeklyHabitTracker[]) => (this.newWeeklyHabitTrackersSharedCollection = newWeeklyHabitTrackers)
      );
  }
}
