import {Component, OnInit} from '@angular/core';

import {PageMetaService} from '../page-meta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';

  showMNFNowOpen: boolean;
  showGreenMatchFund: boolean;
  showChampionsForChildren: boolean;
  showExplore: boolean;

  public constructor(private pageMeta: PageMetaService) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );

    const viewingTime = new Date();

    const mhfOpening = new Date("2023-02-20T00:00:00.000+00:00");
    const mnfClosing = new Date("2023-03-26T23:59:00.000+00:00");
    const cfcClosing = new Date("2023-02-27T00:00:00.000+00:00");

    this.showMNFNowOpen =
      viewingTime >= mhfOpening &&
      viewingTime < mnfClosing;

    this.showGreenMatchFund = viewingTime < mhfOpening;
    this.showExplore = viewingTime >= cfcClosing;
    this.showChampionsForChildren = viewingTime < cfcClosing;
  }
}
