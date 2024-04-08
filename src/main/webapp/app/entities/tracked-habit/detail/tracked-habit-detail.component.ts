import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrackedHabit } from '../tracked-habit.model';

@Component({
  selector: 'jhi-tracked-habit-detail',
  templateUrl: './tracked-habit-detail.component.html',
})
export class TrackedHabitDetailComponent implements OnInit {
  trackedHabit: ITrackedHabit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trackedHabit }) => {
      this.trackedHabit = trackedHabit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
