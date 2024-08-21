import {Component,  OnInit} from '@angular/core';
import {PageMetaService} from "../page-meta.service";
import {ActivatedRoute} from "@angular/router";
import {CompleteDonation, Donation, isLargeDonation} from "../donation.model";
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
  protected donations: CompleteDonation[];
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
}
