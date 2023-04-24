import { Component, Input } from '@angular/core';
import {Campaign} from "../../campaign.model";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {CampaignGroupsService} from "../../campaign-groups.service";
@Component({
  templateUrl: './donation-start-container.component.html',
  styleUrls: ['./donation-start-container.component.scss']
})
export class DonationStartContainerComponent {
  campaign: Campaign;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
  }

  // Three functions below copied from campaign-info.component. Apologies for duplication.
  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }
}
