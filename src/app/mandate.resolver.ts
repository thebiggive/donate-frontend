import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {Mandate} from './mandate.model';
import {RegularGivingService} from './regularGiving.service';

@Injectable(
  {providedIn: 'root'}
)
export class MandateResolver {
  constructor(private regularGivingService: RegularGivingService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Mandate> {
    const mandateId = route.paramMap.get('mandateId');
    if (!mandateId) {
      throw new Error('mandateId param missing in route');
    }

    return this.regularGivingService.getActiveMandate(mandateId);
  }
}
