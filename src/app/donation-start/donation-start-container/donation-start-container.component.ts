import { Component, Input, OnInit } from '@angular/core';
import {Campaign} from "../../campaign.model";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import { Donation } from 'src/app/donation.model';
@Component({
  templateUrl: './donation-start-container.component.html',
  styleUrls: ['./donation-start-container.component.scss']
})
export class DonationStartContainerComponent implements OnInit {
  campaign: Campaign;
  donation: Donation;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
  }
}
