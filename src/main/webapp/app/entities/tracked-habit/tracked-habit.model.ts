import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { IHabit, NewHabit } from '../habit/habit.model';
import { INewWeeklyHabitTracker, NewNewWeeklyHabitTracker } from '../new-weekly-habit-tracker/new-weekly-habit-tracker.model';

export interface ITrackedHabit {
  id: number;
  completed?: boolean | null;
  trackedHabitID?: number | null;
  rel1?: Pick<IHabit, 'id' | 'habitName'> | null;
  rel2?: Pick<INewWeeklyHabitTracker, 'id' | 'recordID'> | null;
}

export type NewTrackedHabit = Omit<ITrackedHabit, 'id'> & { id: null };
