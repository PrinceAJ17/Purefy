import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPoints, NewPoints } from '../points.model';

export type PartialUpdatePoints = Partial<IPoints> & Pick<IPoints, 'id'>;

export type EntityResponseType = HttpResponse<IPoints>;
export type EntityArrayResponseType = HttpResponse<IPoints[]>;

@Injectable({ providedIn: 'root' })
export class PointsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/points');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(points: NewPoints): Observable<EntityResponseType> {
    return this.http.post<IPoints>(this.resourceUrl, points, { observe: 'response' });
  }

  update(points: IPoints): Observable<EntityResponseType> {
    return this.http.put<IPoints>(`${this.resourceUrl}/${this.getPointsIdentifier(points)}`, points, { observe: 'response' });
  }

  partialUpdate(points: PartialUpdatePoints): Observable<EntityResponseType> {
    return this.http.patch<IPoints>(`${this.resourceUrl}/${this.getPointsIdentifier(points)}`, points, { observe: 'response' });
  }

  deductPoints(username: string, points: number): Observable<any> {
    return this.http.post(`${this.resourceUrl}/deduct`, { username, points });
  }

  updatePoints(username: string, points: number): Observable<any> {
    const updatePointsUrl = `${this.resourceUrl}/update`;
    return this.http.post(updatePointsUrl, { username, points }, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoints>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoints[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPointsIdentifier(points: Pick<IPoints, 'id'>): number {
    return points.id;
  }

  comparePoints(o1: Pick<IPoints, 'id'> | null, o2: Pick<IPoints, 'id'> | null): boolean {
    return o1 && o2 ? this.getPointsIdentifier(o1) === this.getPointsIdentifier(o2) : o1 === o2;
  }

  addPointsToCollectionIfMissing<Type extends Pick<IPoints, 'id'>>(
    pointsCollection: Type[],
    ...pointsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const points: Type[] = pointsToCheck.filter(isPresent);
    if (points.length > 0) {
      const pointsCollectionIdentifiers = pointsCollection.map(pointsItem => this.getPointsIdentifier(pointsItem)!);
      const pointsToAdd = points.filter(pointsItem => {
        const pointsIdentifier = this.getPointsIdentifier(pointsItem);
        if (pointsCollectionIdentifiers.includes(pointsIdentifier)) {
          return false;
        }
        pointsCollectionIdentifiers.push(pointsIdentifier);
        return true;
      });
      return [...pointsToAdd, ...pointsCollection];
    }
    return pointsCollection;
  }
}
