import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from 'src/app/campaign.model';
import {ImageService} from "../../image.service";

@Component({
  selector: 'app-donation-start-secondary',
  templateUrl: './donation-start-secondary.component.html',
  styleUrls: ['./donation-start-secondary.component.scss']
})
export class DonationStartSecondaryComponent implements OnInit {
  @Input() campaign: Campaign;
  bannerUri: string | null;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    if(this.campaign) {
      this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);
    }
  }
}
