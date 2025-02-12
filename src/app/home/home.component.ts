import {AsyncPipe, isPlatformBrowser} from '@angular/common';
import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RESPONSE} from '../../express.tokens';
import { Response } from "express";

import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "../highlight-cards/HighlightCard";
import {environment} from "../../environments/environment";
import {NavigationService} from "../navigation.service";
import {allChildComponentImports} from '../../allChildComponentImports';
import {HighlightCardsComponent} from '../highlight-cards/highlight-cards.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: 'home.component.scss',
  standalone: true,
  imports: [
    ...allChildComponentImports,
    HighlightCardsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    private navigationService: NavigationService,
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
      '/assets/images/social-banner.png',
    );
    this.stats = this.route.snapshot.data.stats;
    this.highlightCards = this.route.snapshot.data.highlights;
    const queryParams = this.route.snapshot.queryParams;
    const redirectPath = this.navigationService.getPotentialRedirectPathAndUpdateSignal(this.highlightCards);

    if (
      environment.environmentId !== 'regression' &&
      !queryParams.hasOwnProperty('noredirect') &&
      redirectPath !== null
    ) {
        if (isPlatformBrowser(this.platformId)) {
          void this.router.navigate(
            [redirectPath],
            {
              replaceUrl: true, // As we are redirecting immediately it would be confusing to leave a page the user hasn't seen in their history.
            }
          );
        } else {
          this.response.redirect(302, redirectPath);
        }
    } else {
      this.mayBeAboutToRedirect = false;
    }
  }
}
