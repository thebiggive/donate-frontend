import {Component, OnInit} from '@angular/core';

import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "./HighlightCard";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';

  highlightCards: readonly HighlightCard[] = [
    {
      headerText: 'DEC Ukraine Humanitarian Appeal',
      backgroundImageUrl: new URL('/assets/images/emergency-card.png', environment.donateGlobalUriPrefix),
      iconColor: 'brand-5',
      bodyText: '15 June to 31 July 2023',
      button: {
        text: 'See results',
        href: new URL('/campaign/a056900002RXrG9AAL', environment.donateGlobalUriPrefix)
      }
    },
    {
      headerText: 'Applications for Anchor Match Fund are open!',
      backgroundImageUrl: new URL('/assets/images/anchor-match-fund.jpg', environment.donateGlobalUriPrefix),
      iconColor: 'primary',
      bodyText: 'Second edition deadline is 31st December 2023',
      button: {
        text: 'Apply now',
        href: new URL('/anchor-match-fund/', environment.blogUriPrefix)
      }
    },
    {
      headerText: 'One donation. Twice the impact.',
      bodyText: "You donate.\nWe double it.",
      iconColor: "primary",
      backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', environment.donateGlobalUriPrefix),
      button: {
        text: "Explore now",
        href: new URL('/explore', environment.donateGlobalUriPrefix),
      }
    }
  ];

  public constructor(
    private pageMeta: PageMetaService,
  ) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
  }
}
