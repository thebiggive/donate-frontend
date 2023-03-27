import {Component, OnInit} from '@angular/core';

import {PageMetaService} from '../page-meta.service';
import {highlightCard} from "./hilightCard";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';

  highlightCards: readonly highlightCard[];

  public constructor(private pageMeta: PageMetaService) {}

  ngOnInit() {
    this.highlightCards = [
      {
        headerText: 'Turkey-Syria Earthquake Appeal',
        bodyText: "Double the impact of your donation",
        iconColor: "brand-4",
        backgroundImageUrl: new URL('/assets/images/emergency-card.png', environment.donateUriPrefix),
        button: {
          text: "Donate now",
          href: new URL('/turkey-syria-earthquake-appeal', environment.donateUriPrefix),
        }
      },
      {
        headerText: 'One donation. Twice the impact.',
        bodyText: "You donate.\nWe double it.",
        iconColor: "primary",
        backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', environment.donateUriPrefix),
        button: {
          text: "Explore now",
          href: new URL('/explore', environment.donateUriPrefix),
        }
      },
    ];

    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
  }
}
