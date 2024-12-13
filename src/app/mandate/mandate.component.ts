import {Component, OnInit} from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {Mandate} from "../mandate.model";
import {Donation} from "../donation.model";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mandate',
  standalone: true,
  imports: [
    ComponentsModule,
    DatePipe,
    ExactCurrencyPipe
  ],
  templateUrl: './mandate.component.html',
  styleUrl: './mandate.component.scss'
})
export class MandateComponent implements OnInit {
  complete: boolean = true;
  encodedShareUrl: string = '';
  encodedPrefilledText: string = '';
  donation: Donation;
  mandate: Mandate;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.mandate = this.route.snapshot.data.mandate;
  }

  // @todo-regular-giving: calculate the total in matchbot and show on template
  // totalPaid: number = 0;

  // @todo-regular-giving : replace this with a mandate fetched from matchbot
  // mandate: Mandate = {
  //   id: 'f7037101-b555-4482-afff-43145fac78bb',
  //   campaignId: 'a056900002TPVz5AAH',
  //   charityName: '0011r00002Hoe8lAAB',
  //   donationAmount: {
  //     amountInPence: 10_00,
  //     currency: "GBP"
  //   },
  //   matchedAmount: {
  //     amountInPence: 10_00,
  //     currency: "GBP"
  //   },
  //   giftAid: false,
  //   numberOfMatchedDonations: 3,
  //   status: 'active',
  //   schedule: {
  //     type: "monthly",
  //     dayOfMonth: 1,
  //     activeFrom: '2024-12-06 11:00:17',
  //     expectedNextPaymentDate: '2025-01-01 11:00:17'
  //   }
  // };

}
