import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { IdentityService } from './identity.service';

export type EmailVerificationToken =
  | {
      valid: false;
      person_uuid?: string;
      email_address?: string;
      first_name?: string;
      last_name?: string;
      secretNumber?: string;
    }
  | {
      valid: true;
      person_uuid: string;
      email_address: string;
      first_name: string;
      last_name: string;
      secretNumber: string;
    };

@Injectable({ providedIn: 'root' })
export class EmailVerificationTokenResolver implements Resolve<EmailVerificationToken | null> {
  constructor(private identityService: IdentityService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<EmailVerificationToken | null> {
    const secretNumber = route.queryParams['c'];
    const personUUID = route.queryParams['u'];

    if (!secretNumber || !personUUID) {
      return null;
    }

    try {
      return {
        ...(await this.identityService.getEmailVerificationTokenDetails({ secretNumber, personUUID })),
        person_uuid: personUUID,
        secretNumber: secretNumber,
      };
    } catch (error) {
      console.log(error);
      return { valid: false };
    }
  }
}
