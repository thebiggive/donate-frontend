import {DonationService} from "./donation.service";
import {inject} from "@angular/core";
import {IdentityService} from "./identity.service";
import {Donation} from "./donation.model";
import {ResolveFn} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";

export const myDonationsResolver: ResolveFn<readonly Donation[] | undefined> = () => {
  const donationService = inject(DonationService);
  const identityService = inject(IdentityService);

  const person = identityService.getLoggedInPerson();

  return person.pipe(switchMap((person) => {
    if (! person) {
      return of(undefined);
    }
    return donationService.getPastDonations(person.id);
  }));
}
