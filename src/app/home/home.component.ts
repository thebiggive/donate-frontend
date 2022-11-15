import { Component, OnInit } from '@angular/core';

import { PageMetaService } from '../page-meta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';
  highlightCard1Title = 'Double your donation\nin the Christmas Challenge 2022';
  highlightCard1Subtitle = 'Donate between\n29 Nov – 6 Dec';

  public constructor(private pageMeta: PageMetaService) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'The Big Give',
      'The Big Give &ndash; discover campaigns and donate',
      false,
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
  }
}
