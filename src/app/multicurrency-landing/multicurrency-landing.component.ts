import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFacebookSquare, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { PageMetaService } from '../page-meta.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-multicurrency-landing',
  templateUrl: './multicurrency-landing.component.html',
  styleUrls: ['./multicurrency-landing.component.scss'],
})
export class MulticurrencyLandingComponent implements OnInit {
  faFacebookSquare = faFacebookSquare;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  shareUrl = environment.donateGlobalUriPrefix + '/gogiveone';
  // Ticket DON-474.
  prefilledText = encodeURIComponent('Donate to the #GoGiveOne campaign to help COVID-19 vaccines reach the rest of the world, prioritizing those who need them the most in countries that cannot afford them! Click below to donate today!');

  constructor(private pageMeta: PageMetaService, private route: ActivatedRoute) {}

  ngOnInit() {
    const campaign = this.route.snapshot.data.campaign;
    this.pageMeta.setCommon(
      campaign.title,
      campaign.summary,
      campaign.currencyCode !== 'GBP',
      campaign.bannerUri,
    );
  }
}
