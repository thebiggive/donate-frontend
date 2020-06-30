import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

declare var stripe: {
  createToken: (card: any) => any,
};
declare var elements: {
  create: (type: string, options: any) => any,
};

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor() {}

  init() {
    // Loading Stripe JS itself here seemed to create a race condition, so to keep things
    // simple and reliable it is in each `index.*.html`. The library is required to
    // be hotlinked from stripe.com.
    const scriptInitStripeElements = document.createElement('script');
    scriptInitStripeElements.innerHTML = `
      var stripe = Stripe('${environment.psps.stripe.publishableKey}');
      var elements = stripe.elements();
    `;
    document.head.appendChild(scriptInitStripeElements);
  }

  // TODO try out loading via module for TS support.
  createCard(hidePostalCode: boolean): any {
    return elements.create('card', { hidePostalCode });
  }

  createToken(card: any): any {
    return stripe.createToken(card);
  }
}
