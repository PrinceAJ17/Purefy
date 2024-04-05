import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHabitExtended } from '../habit-extended.model';
import { HabitExtendedService } from '../service/habit-extended.service';

@Injectable({ providedIn: 'root' })
export class HabitExtendedRoutingResolveService implements Resolve<IHabitExtended | null> {
  constructor(protected service: HabitExtendedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHabitExtended | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((habitExtended: HttpResponse<IHabitExtended>) => {
          if (habitExtended.body) {
            return of(habitExtended.body);
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
