import { Component, OnInit, inject } from '@angular/core';
import { PageMetaService } from '../page-meta.service';
import { ActivatedRoute } from '@angular/router';
import {
  CompleteDonation,
  Donation,
  EnrichedDonation,
  isLargeDonation,
  withComputedProperties,
} from '../donation.model';
import { DatePipe } from '@angular/common';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import { allChildComponentImports } from '../../allChildComponentImports';
import { myRegularGivingPath } from '../app-routing';

@Component({
  selector: 'app-my-donations',
  imports: [...allChildComponentImports, ExactCurrencyPipe, DatePipe],
  templateUrl: './my-donations.component.html',
  styleUrl: './my-donations.component.scss',
})
export class MyDonationsComponent implements OnInit {
  private pageMeta = inject(PageMetaService);
  private route = inject(ActivatedRoute);

  protected donations!: EnrichedDonation[];
  protected atLeastOneLargeRecentDonation?: boolean;
  protected readonly myRegularGivingPath = myRegularGivingPath;

  ngOnInit() {
    this.pageMeta.setCommon('Your Donation History', 'Your Big Give donations', null);

    this.donations = this.route.snapshot.data.donations.map(withComputedProperties);

    this.atLeastOneLargeRecentDonation = this.donations.filter(donationIsRecent).some(isLargeDonation);

    function donationIsRecent(donation: Donation) {
      if (typeof donation.createdTime === 'undefined') {
        console.error('No created time set for donation');
        return false;
      }

      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(new Date().getFullYear() - 2);

      return new Date(donation.createdTime) > twoYearsAgo;
    }
  }

  displayMethodType(donation: Donation) {
    switch (donation.pspMethodType) {
      case 'card':
        return 'Card payment';
      case 'customer_balance':
        return 'Donation Funds payment';
    }
  }

  /**
   * We expect tip amounts for customer balance donations to always be zero, if they are in fact zero no need
   * to display them.
   */
  shouldShowTipForDonation(donation: CompleteDonation) {
    // We don't show zero tips for customer balance donations or regular giving donations because we don't ask donors
    // for tips on those types of donations - so they should always have zero tips. But in case there somehow is a tip
    // on one we would show it here.
    const isTippableDonationType = donation.pspMethodType !== 'customer_balance' && !!donation.mandate;

    return donation.tipAmount !== 0 || isTippableDonationType;
  }
}
