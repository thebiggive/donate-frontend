import { Injectable } from '@angular/core';

import { CharityCheckoutDonation } from './charity-checkout-donation.model';
import { Donation } from './donation.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CharityCheckoutService {

  constructor() { }

  /**
   * Takes a donation that has been successfully initiated and saved in Salesforce, and
   * sends the user on to start the Charity Checkout part of the process, with the details
   * they already provided passed through to that next step.
   *
   * Unfortunately because this is an 'old school' form post to an outside service,
   * although we encapsulate the properties in a proper model, the actual submission
   * must leave the Angular world and piece together a 'real' form directly on `window`.
   * @link https://stackoverflow.com/a/51987295/2803757
   */
  startDonation(donation: Donation) {
    const form = window.document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', environment.psps.enthuse.initUri);
    form.setAttribute('target', '_self');

    const donationPostData = new CharityCheckoutDonation(donation);
    for (const param in donationPostData) {
      if (donationPostData.hasOwnProperty(param)) {
        const paramAsString = donationPostData[param as keyof CharityCheckoutDonation] as string;
        form.appendChild(this.createHiddenElement(param, paramAsString));
      }
    }

    window.document.body.appendChild(form);
    form.submit();
  }

  private createHiddenElement(name: string, value: string): HTMLInputElement {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    hiddenField.setAttribute('type', 'hidden');

    return hiddenField;
  }
}
