import { Component, OnInit } from '@angular/core';

import { PageMetaService } from '../page-meta.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';

  viewingTime: Date;
  showMHFSaveTheDate: boolean;
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

    this.showMHFSaveTheDate = viewingTime < new Date("2023-02-19T23:59:00.000+00:00");
    this.showMNFNowOpen = ! this.showMHFSaveTheDate && viewingTime < new Date("2023-03-26T23:59:00.000+00:00");

    this.showGreenMatchFund = viewingTime < new Date("2023-02-19T23:59:00.000+00:00");

    this.showGreenMatchFund = viewingTime < new Date("2023-02-19T23:59:00.000+00:00");
    this.showChampionsForChildren = viewingTime < new Date("2023-02-26T23:59:00.000+00:00");
    this.showExplore = viewingTime >= new Date("2023-02-19T23:59:00.000+00:00");
  }
}
