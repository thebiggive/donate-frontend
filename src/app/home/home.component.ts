import {isPlatformBrowser} from "@angular/common";
import {Component, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RESPONSE} from '../../express.tokens';
import { Response } from "express";

import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "../highlight-cards/HighlightCard";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: 'home.component.scss',
})
export class HomeComponent implements OnInit {
  stats: {
    totalRaisedFormatted: string,
    totalCountFormatted: string
  };

  private currentTime = new Date();

  /**
   * Prevents the user seeing the content if we're about to redirect them to a different page.
   * As suggested at https://stackoverflow.com/a/58962726/2526181
   */
  protected mayBeAboutToRedirect: boolean = true;

  protected highlightCards: HighlightCard[];

  public constructor(
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {
  }


  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
    this.stats = this.route.snapshot.data.stats;
    this.highlightCards = this.route.snapshot.data.highlights;
    const queryParams = this.route.snapshot.queryParams;

    if (environment.environmentId !== 'production') {
      if (queryParams?.simulatedDate) {
        const simulatedDate = new Date(queryParams.simulatedDate);
        if (isNaN(simulatedDate.getTime())) {
          alert("cant parse simulated date given");
          throw new Error("Invalid date");
        }
        this.currentTime = simulatedDate;
      }
    }

    // start the redirect 12 hours in advance of CC open:
    const startRedirectingToCCAt = new Date('2024-12-03T00:00:00+00:00');

    // end the redirect exactly at the time CC closes.
    const CCCloseDate = new Date('2024-12-10T12:00:00+00:00');

    if (
      !queryParams.hasOwnProperty('noredirect') &&
      this.currentTime >= startRedirectingToCCAt &&
      this.currentTime < CCCloseDate
      ) {
        const redirectSlugIncSlash = '/christmas-challenge-2024';
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(
            [redirectSlugIncSlash],
            {
              replaceUrl: true, // As we are redirecting immediately it would be confusing to leave a page the user hasn't seen in their history.

            }
          );
        } else {
          this.response.redirect(302, redirectSlugIncSlash);
        }
    } else {
      this.mayBeAboutToRedirect = false;
    }
  }
}
