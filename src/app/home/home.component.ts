import {Component, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RESPONSE} from '../../express.tokens';
import { Response } from "express";

import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "../highlight-cards/HighlightCard";

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
  }
}
