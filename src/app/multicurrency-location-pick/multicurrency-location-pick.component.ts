import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { countries, Country } from 'country-code-lookup';

import { CampaignSummary } from '../campaign-summary.model';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-multicurrency-location-pick',
  templateUrl: './multicurrency-location-pick.component.html',
  styleUrls: ['./multicurrency-location-pick.component.scss'],
})
export class MulticurrencyLocationPickComponent implements OnInit {
  campaigns: CampaignSummary[];
  countryOptions: Country[];
  pickForm: UntypedFormGroup;

  constructor(
    private donationService: DonationService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.campaigns = this.route.snapshot.data.campaigns;

    // Sort by name, with locale support so Åland Islands doesn't come after 'Z..'.
    // https://stackoverflow.com/a/39850483/2803757
    this.countryOptions = countries.sort((cA, cB)  => cA.country.localeCompare(cB.country));
    this.pickForm = this.formBuilder.group({
      // In ISO 3166-1 alpha-2 format.
      country: [this.donationService.getDefaultCounty(), Validators.required],
    });
  }

  startDonation() {
    let goToCampaignId: string | undefined;
    for (const campaign of this.campaigns) {
      if (campaign.defaultForCountries.includes(this.pickForm.value.country)) {
        goToCampaignId = campaign.id;
        break; // Don't e.g. check for 'Other', as we have an exact match.
      } else if (campaign.defaultForCountries.includes('Other')) {
        goToCampaignId = campaign.id; // Tee this up but keep looping in case there's an exact match.
      }
    }

    if (!goToCampaignId) {
       // Shouldn't happen if campaigns set up right. Fallback so we don't crash if they're not.
      this.router.navigateByUrl('/explore');
      return;
    }

    this.router.navigateByUrl(`/donate/${goToCampaignId}`);
  }
}
