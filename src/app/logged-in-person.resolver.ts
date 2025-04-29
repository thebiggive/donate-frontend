import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { IdentityService } from './identity.service';
import { Person } from './person.model';

@Injectable({ providedIn: 'root' })
export class LoggedInPersonResolver implements Resolve<Person | null> {
  constructor(private identityService: IdentityService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<Person | null> {
    return this.identityService.getLoggedInPerson();
  }
}
