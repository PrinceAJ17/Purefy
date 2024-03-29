import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEntriesFeature } from '../entries-feature.model';
import { EntriesFeatureService } from '../service/entries-feature.service';

@Injectable({ providedIn: 'root' })
export class EntriesFeatureRoutingResolveService implements Resolve<IEntriesFeature | null> {
  constructor(protected service: EntriesFeatureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEntriesFeature | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((entriesFeature: HttpResponse<IEntriesFeature>) => {
          if (entriesFeature.body) {
            return of(entriesFeature.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
