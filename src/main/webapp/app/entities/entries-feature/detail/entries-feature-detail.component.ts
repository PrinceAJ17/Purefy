import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntriesFeature } from '../entries-feature.model';

@Component({
  selector: 'jhi-entries-feature-detail',
  templateUrl: './entries-feature-detail.component.html',
})
export class EntriesFeatureDetailComponent implements OnInit {
  entriesFeature: IEntriesFeature | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entriesFeature }) => {
      this.entriesFeature = entriesFeature;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
