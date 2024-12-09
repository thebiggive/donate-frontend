import { Component } from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
// import {FaIconComponent} from "@fortawesome/angular-fontawesome";
// import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Mandate} from "../mandate.model";
import {Donation} from "../donation.model";

@Component({
  selector: 'app-mandate',
  standalone: true,
  imports: [
    ComponentsModule,
    DatePipe,
    ExactCurrencyPipe,
    //FaIconComponent,
    //MatProgressSpinner
  ],
  templateUrl: './mandate.component.html',
  styleUrl: './mandate.component.scss'
})
export class MandateComponent {
  personId: string = 'donor-id';
  complete: boolean = true;
  encodedShareUrl: string = '';
  encodedPrefilledText: string = '';
  donation: Donation;
  //giftAidAmount: number = 0;
  // TODO: we might want to keep the total donated amount as part of the regular giving mandate
  // totalPaid: number = 0;
  /** @todo-regular-giving : replace this with a mandate fetched from matchbot *//
  mandate: Mandate = {
    id: 'f7037101-b555-4482-afff-43145fac78bb',
    campaignId: 'a056900002TPVz5AAH',
    charityName: '0011r00002Hoe8lAAB',
    numberOfMatchedDonations: 'for the next three months',
    status: 'active',
    "schedule": {
      "type": "monthly",
      "dayOfMonth": 1,
      "activeFrom": '2024-12-06 11:00:17',
      "expectedNextPaymentDate": '2025-01-01 11:00:17'
  },
    donationAmount: {
      "amountInPence": 10,
      "currency": "GBP"
    },
    matchedAmount: {
      "amountInPence": 30,
      "currency": "GBP"
    },
    giftAid: false,
  }
}
