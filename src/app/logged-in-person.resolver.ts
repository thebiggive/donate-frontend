import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { IdentityService } from './identity.service';
import { Person } from './person.model';

@Injectable({ providedIn: 'root' })
export class LoggedInPersonResolver implements Resolve<Person | null> {
  private identityService = inject(IdentityService);

  resolve(_route: ActivatedRouteSnapshot): Observable<Person | null> {
    return this.identityService.getLoggedInPerson();
  }
}
