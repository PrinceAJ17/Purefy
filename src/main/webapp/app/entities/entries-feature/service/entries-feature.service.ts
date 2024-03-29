import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntriesFeature, NewEntriesFeature } from '../entries-feature.model';

export type PartialUpdateEntriesFeature = Partial<IEntriesFeature> & Pick<IEntriesFeature, 'id'>;

type RestOf<T extends IEntriesFeature | NewEntriesFeature> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestEntriesFeature = RestOf<IEntriesFeature>;

export type NewRestEntriesFeature = RestOf<NewEntriesFeature>;

export type PartialUpdateRestEntriesFeature = RestOf<PartialUpdateEntriesFeature>;

export type EntityResponseType = HttpResponse<IEntriesFeature>;
export type EntityArrayResponseType = HttpResponse<IEntriesFeature[]>;

@Injectable({ providedIn: 'root' })
export class EntriesFeatureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/entries-features');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(entriesFeature: NewEntriesFeature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entriesFeature);
    return this.http
      .post<RestEntriesFeature>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(entriesFeature: IEntriesFeature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entriesFeature);
    return this.http
      .put<RestEntriesFeature>(`${this.resourceUrl}/${this.getEntriesFeatureIdentifier(entriesFeature)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(entriesFeature: PartialUpdateEntriesFeature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entriesFeature);
    return this.http
      .patch<RestEntriesFeature>(`${this.resourceUrl}/${this.getEntriesFeatureIdentifier(entriesFeature)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEntriesFeature>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEntriesFeature[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEntriesFeatureIdentifier(entriesFeature: Pick<IEntriesFeature, 'id'>): number {
    return entriesFeature.id;
  }

  compareEntriesFeature(o1: Pick<IEntriesFeature, 'id'> | null, o2: Pick<IEntriesFeature, 'id'> | null): boolean {
    return o1 && o2 ? this.getEntriesFeatureIdentifier(o1) === this.getEntriesFeatureIdentifier(o2) : o1 === o2;
  }

  addEntriesFeatureToCollectionIfMissing<Type extends Pick<IEntriesFeature, 'id'>>(
    entriesFeatureCollection: Type[],
    ...entriesFeaturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const entriesFeatures: Type[] = entriesFeaturesToCheck.filter(isPresent);
    if (entriesFeatures.length > 0) {
      const entriesFeatureCollectionIdentifiers = entriesFeatureCollection.map(
        entriesFeatureItem => this.getEntriesFeatureIdentifier(entriesFeatureItem)!
      );
      const entriesFeaturesToAdd = entriesFeatures.filter(entriesFeatureItem => {
        const entriesFeatureIdentifier = this.getEntriesFeatureIdentifier(entriesFeatureItem);
        if (entriesFeatureCollectionIdentifiers.includes(entriesFeatureIdentifier)) {
          return false;
        }
        entriesFeatureCollectionIdentifiers.push(entriesFeatureIdentifier);
        return true;
      });
      return [...entriesFeaturesToAdd, ...entriesFeatureCollection];
    }
    return entriesFeatureCollection;
  }

  // In EntriesFeatureService
  getAll(): Observable<IEntriesFeature[]> {
    return this.http.get<IEntriesFeature[]>(this.resourceUrl);
  }

  protected convertDateFromClient<T extends IEntriesFeature | NewEntriesFeature | PartialUpdateEntriesFeature>(
    entriesFeature: T
  ): RestOf<T> {
    return {
      ...entriesFeature,
      date: entriesFeature.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEntriesFeature: RestEntriesFeature): IEntriesFeature {
    return {
      ...restEntriesFeature,
      date: restEntriesFeature.date ? dayjs(restEntriesFeature.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEntriesFeature>): HttpResponse<IEntriesFeature> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEntriesFeature[]>): HttpResponse<IEntriesFeature[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
