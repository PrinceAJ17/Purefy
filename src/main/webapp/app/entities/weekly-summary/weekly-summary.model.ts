import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

export interface IWeeklySummary {
  id: number;
  summaryID?: number | null;
  summaryText?: string | null;
}

export type NewWeeklySummary = Omit<IWeeklySummary, 'id'> & { id: null };
