import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrackedHabit } from '../tracked-habit.model';
import { TrackedHabitService } from '../service/tracked-habit.service';

@Injectable({ providedIn: 'root' })
export class TrackedHabitRoutingResolveService implements Resolve<ITrackedHabit | null> {
  constructor(protected service: TrackedHabitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrackedHabit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((trackedHabit: HttpResponse<ITrackedHabit>) => {
          if (trackedHabit.body) {
            return of(trackedHabit.body);
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
