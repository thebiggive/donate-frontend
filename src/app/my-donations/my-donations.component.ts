import {Component,  OnInit} from '@angular/core';
import {PageMetaService} from "../page-meta.service";
import {ActivatedRoute} from "@angular/router";
import {Donation, isLargeDonation} from "../donation.model";
import {AsyncPipe, DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {allChildComponentImports} from "../../allChildComponentImports";

@Component({
  selector: 'app-my-donations',
  standalone: true,
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    ExactCurrencyPipe,
    DatePipe,
    MatProgressSpinner
  ],
  templateUrl: './my-donations.component.html',
  styleUrl: './my-donations.component.scss'
})
export class MyDonationsComponent implements OnInit{
  protected donations: Donation[];
  protected atLeastOneDonationWasLarge: boolean;

  constructor(
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give - Your Donation History', '', null
    );

    this.donations = this.route.snapshot.data.donations;
    this.atLeastOneDonationWasLarge = this.donations.some(isLargeDonation);
  }

  displayMethodType(donation: Donation) {
    switch (donation.pspMethodType) {
      case "card": return "Card payment";
      case "customer_balance": return "Donation Funds payment"
    }
  }

  protected totalCharged(donation: Donation): number
  {
    // this duplicates logic in DonationThanksComponent.setDonation and also in matchbot's function
    // \MatchBot\Domain\Donation::getAmountFractionalIncTip . I think it's probably worth removing the duplication by
    // putting all the logic in matchbot, and also running it just once and saving the result to the database so
    // we know we're always displaying the total using the logic as it existed at the time the donation was made.

    return donation.donationAmount + donation.feeCoverAmount + donation.tipAmount
  }
}
