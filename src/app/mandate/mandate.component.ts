import { Component } from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
// import {FaIconComponent} from "@fortawesome/angular-fontawesome";
// import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Mandate} from "../mandate.model";

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
  personId = 'donor-id';
  complete = true;
  encodedShareUrl = '';
  encodedPrefilledText: string = '';
  donation: any = {};
  totalValue: number = 20;
  //giftAidAmount: number = 0;
  // TODO: we might want to keep the total donated amount as part of the regular giving mandate
  // totalPaid: 0;
  mandate: Mandate = {
  id: 'f7037101-b555-4482-afff-43145fac78bb',
  campaignId: 'a056900002TPVz5AAH',
  charityName: '0011r00002Hoe8lAAB',
  matchingPeriodText: 'for the next three months',
  status: 'active',
  "schedule": {
    "type": "monthly",
    "dayOfMonth": 1,
    "activeFrom": '2024-12-06 11:00:17',
    "expectedNextPaymentDate": '2025-01-01 11:00:17'
  },
  giftAid: false,
  "amount": {
    "amountInPence": 10,
    "currency": "GBP"
  },
}


}
