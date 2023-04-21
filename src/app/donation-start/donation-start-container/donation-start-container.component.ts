import { Component, Input } from '@angular/core';
import {Campaign} from "../../campaign.model";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
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
}
