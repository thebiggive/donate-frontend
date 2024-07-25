import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {PageMetaService} from "../page-meta.service";
import {IdentityService} from "../identity.service";
import {DonationService} from "../donation.service";
import {Person} from "../person.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {Donation, isLargeDonation} from "../donation.model";
import {AsyncPipe, DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {allChildComponentImports} from "../../allChildComponentImports";
import {map} from "rxjs/operators";

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

    this.donations = this.route.snapshot.data.donations
    this.atLeastOneDonationWasLarge = this.donations.some(isLargeDonation);
  }

  displayMethodType(donation: Donation) {
    switch (donation.pspMethodType) {
      case "card": return "Card";
      case "customer_balance": return "Donation Funds"
    }
  }
}
