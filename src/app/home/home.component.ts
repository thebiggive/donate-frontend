import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  stats: {
    totalRaisedFormatted: string,
    totalCountFormatted: string
  };

  
  highlightCards: readonly HighlightCard[] = [
    {
      headerText: 'Upcoming Match Funding Campaigns',
      bodyText: "Discover our exciting range of match funding opportunities for 2023/2024",
      iconColor: "tertiary",
      backgroundImageUrl: new URL('/assets/images/peach-texture.jpg', environment.donateGlobalUriPrefix),
      button: {
        text: "Find out more",
        href: new URL('/charities', environment.blogUriPrefix),
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
    },
  ];

  public constructor(
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
    this.stats = this.route.snapshot.data.stats;
  }
}
