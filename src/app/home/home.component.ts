import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "./HighlightCard";
import {environment} from "../../environments/environment";

const wgmfCampaignIsOpen = new Date() > new Date('2023-10-11T12:00:00+01:00');

const WGMFCard = wgmfCampaignIsOpen ? {
  headerText: "Woman and Girl\'s Match Fund",
  bodyText: "11th - 18th October 2023",
  iconColor: "brand-wgmf-purple",
  backgroundImageUrl: new URL('/assets/images/wmg-purple-texture.jpg', environment.donateGlobalUriPrefix),
  button: {
    text: "See results",
    href: new URL('/women-and-girls-2023/', environment.donateGlobalUriPrefix),
  }
} as const :
  {
    headerText: 'Save the date for Women and Girls Match Fund',
    bodyText: "11th - 18th October 2023",
    iconColor: "brand-wgmf-purple",
    backgroundImageUrl: new URL('/assets/images/wmg-purple-texture.jpg', environment.donateGlobalUriPrefix),
    button: {
      text: "Find out more",
      href: new URL('/women-and-girls-2023/', environment.donateGlobalUriPrefix),
    }
  } as const;

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
    WGMFCard,
    {
      headerText: 'Double your donation for Global’s Make Some Noise',
      backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', environment.donateGlobalUriPrefix),
      iconColor: 'primary',
      bodyText: 'Donate between 20th September - 31st October 2023',
      button: {
        text: 'Donate now',
        href: new URL('/campaign/a056900001xpxqVAAQ', environment.donateGlobalUriPrefix)
      }
    },
    {
      headerText: "Applications for Arts for Impact are now open!",
      backgroundImageUrl: new URL('/assets/images/red-coral-texture.png', environment.donateGlobalUriPrefix),
      iconColor: 'brand-afa-pink',
      bodyText: 'Apply by 15th December 2023',
      button: {
        text: "Apply now",
        href: new URL('/artsforimpact/', environment.blogUriPrefix)
      }
    } as const,
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
