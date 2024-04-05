import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHabitExtended, NewHabitExtended } from '../habit-extended.model';

export type PartialUpdateHabitExtended = Partial<IHabitExtended> & Pick<IHabitExtended, 'id'>;

type RestOf<T extends IHabitExtended | NewHabitExtended> = Omit<T, 'habitDate'> & {
  habitDate?: string | null;
};

export type RestHabitExtended = RestOf<IHabitExtended>;

export type NewRestHabitExtended = RestOf<NewHabitExtended>;

export type PartialUpdateRestHabitExtended = RestOf<PartialUpdateHabitExtended>;

export type EntityResponseType = HttpResponse<IHabitExtended>;
export type EntityArrayResponseType = HttpResponse<IHabitExtended[]>;

@Injectable({ providedIn: 'root' })
export class HabitExtendedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/habit-extendeds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(habitExtended: NewHabitExtended): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habitExtended);
    return this.http
      .post<RestHabitExtended>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(habitExtended: IHabitExtended): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habitExtended);
    return this.http
      .put<RestHabitExtended>(`${this.resourceUrl}/${this.getHabitExtendedIdentifier(habitExtended)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(habitExtended: PartialUpdateHabitExtended): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habitExtended);
    return this.http
      .patch<RestHabitExtended>(`${this.resourceUrl}/${this.getHabitExtendedIdentifier(habitExtended)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHabitExtended>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHabitExtended[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHabitExtendedIdentifier(habitExtended: Pick<IHabitExtended, 'id'>): number {
    return habitExtended.id;
  }

  compareHabitExtended(o1: Pick<IHabitExtended, 'id'> | null, o2: Pick<IHabitExtended, 'id'> | null): boolean {
    return o1 && o2 ? this.getHabitExtendedIdentifier(o1) === this.getHabitExtendedIdentifier(o2) : o1 === o2;
  }

  addHabitExtendedToCollectionIfMissing<Type extends Pick<IHabitExtended, 'id'>>(
    habitExtendedCollection: Type[],
    ...habitExtendedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const habitExtendeds: Type[] = habitExtendedsToCheck.filter(isPresent);
    if (habitExtendeds.length > 0) {
      const habitExtendedCollectionIdentifiers = habitExtendedCollection.map(
        habitExtendedItem => this.getHabitExtendedIdentifier(habitExtendedItem)!
      );
      const habitExtendedsToAdd = habitExtendeds.filter(habitExtendedItem => {
        const habitExtendedIdentifier = this.getHabitExtendedIdentifier(habitExtendedItem);
        if (habitExtendedCollectionIdentifiers.includes(habitExtendedIdentifier)) {
          return false;
        }
        habitExtendedCollectionIdentifiers.push(habitExtendedIdentifier);
        return true;
      });
      return [...habitExtendedsToAdd, ...habitExtendedCollection];
    }
    return habitExtendedCollection;
  }

  protected convertDateFromClient<T extends IHabitExtended | NewHabitExtended | PartialUpdateHabitExtended>(habitExtended: T): RestOf<T> {
    return {
      ...habitExtended,
      habitDate: habitExtended.habitDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restHabitExtended: RestHabitExtended): IHabitExtended {
    return {
      ...restHabitExtended,
      habitDate: restHabitExtended.habitDate ? dayjs(restHabitExtended.habitDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHabitExtended>): HttpResponse<IHabitExtended> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHabitExtended[]>): HttpResponse<IHabitExtended[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
