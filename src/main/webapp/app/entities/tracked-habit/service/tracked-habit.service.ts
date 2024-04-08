import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrackedHabit, NewTrackedHabit } from '../tracked-habit.model';

export type PartialUpdateTrackedHabit = Partial<ITrackedHabit> & Pick<ITrackedHabit, 'id'>;

export type EntityResponseType = HttpResponse<ITrackedHabit>;
export type EntityArrayResponseType = HttpResponse<ITrackedHabit[]>;

@Injectable({ providedIn: 'root' })
export class TrackedHabitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tracked-habits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trackedHabit: NewTrackedHabit): Observable<EntityResponseType> {
    return this.http.post<ITrackedHabit>(this.resourceUrl, trackedHabit, { observe: 'response' });
  }

  update(trackedHabit: ITrackedHabit): Observable<EntityResponseType> {
    return this.http.put<ITrackedHabit>(`${this.resourceUrl}/${this.getTrackedHabitIdentifier(trackedHabit)}`, trackedHabit, {
      observe: 'response',
    });
  }

  partialUpdate(trackedHabit: PartialUpdateTrackedHabit): Observable<EntityResponseType> {
    return this.http.patch<ITrackedHabit>(`${this.resourceUrl}/${this.getTrackedHabitIdentifier(trackedHabit)}`, trackedHabit, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrackedHabit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrackedHabit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTrackedHabitIdentifier(trackedHabit: Pick<ITrackedHabit, 'id'>): number {
    return trackedHabit.id;
  }

  compareTrackedHabit(o1: Pick<ITrackedHabit, 'id'> | null, o2: Pick<ITrackedHabit, 'id'> | null): boolean {
    return o1 && o2 ? this.getTrackedHabitIdentifier(o1) === this.getTrackedHabitIdentifier(o2) : o1 === o2;
  }

  addTrackedHabitToCollectionIfMissing<Type extends Pick<ITrackedHabit, 'id'>>(
    trackedHabitCollection: Type[],
    ...trackedHabitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const trackedHabits: Type[] = trackedHabitsToCheck.filter(isPresent);
    if (trackedHabits.length > 0) {
      const trackedHabitCollectionIdentifiers = trackedHabitCollection.map(
        trackedHabitItem => this.getTrackedHabitIdentifier(trackedHabitItem)!
      );
      const trackedHabitsToAdd = trackedHabits.filter(trackedHabitItem => {
        const trackedHabitIdentifier = this.getTrackedHabitIdentifier(trackedHabitItem);
        if (trackedHabitCollectionIdentifiers.includes(trackedHabitIdentifier)) {
          return false;
        }
        trackedHabitCollectionIdentifiers.push(trackedHabitIdentifier);
        return true;
      });
      return [...trackedHabitsToAdd, ...trackedHabitCollection];
    }
    return trackedHabitCollection;
  }
}
