import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHabitExtended } from '../habit-extended.model';

@Component({
  selector: 'jhi-habit-extended-detail',
  templateUrl: './habit-extended-detail.component.html',
})
export class HabitExtendedDetailComponent implements OnInit {
  habitExtended: IHabitExtended | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habitExtended }) => {
      this.habitExtended = habitExtended;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
