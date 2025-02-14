import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {IdentityService} from './identity.service';
import {Person} from './person.model';

@Injectable(
  {providedIn: 'root'}
)
export class LoggedInPersonResolver {
  constructor(private identityService: IdentityService) {}

  resolve(_route: ActivatedRouteSnapshot): Observable<Person|null> {
    return this.identityService.getLoggedInPerson();
  }
}
