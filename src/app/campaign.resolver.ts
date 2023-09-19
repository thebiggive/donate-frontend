import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Campaign } from './campaign.model';
import {CampaignService, SearchQuery} from './campaign.service';
import {SearchService} from './search.service';

@Injectable()
export class CampaignResolver  {
  constructor(
    public campaignService: CampaignService,
    public searchService: SearchService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    const campaignId = route.paramMap.get('campaignId');
    const campaignSlug = route.paramMap.get('campaignSlug');
    const fundSlug = route.paramMap.get('fundSlug');

    // No . expected in slugs, and these are typically part of opportunistic junk requests.
    if (campaignSlug && campaignSlug.match(new RegExp('[.]+'))) {
      console.log(`CampaignResolver skipping load attempt for junk slug: "${campaignSlug}"`);
      // Because it happens server side & before resolution, `replaceUrl` seems not to
      // work, so just fall back to serving the Home content on the requested path.
      this.router.navigateByUrl('/');
      return EMPTY;
    }

    if (campaignId) {
      return this.load(
        campaignId,
        (identifier: string) => this.campaignService.getOneById(identifier),
      );
    }

    if (campaignSlug && fundSlug && campaignSlug !== "campaign") {
      const query = this.campaignService.buildQuery(this.searchService.selected, 0, campaignId ?? undefined, campaignSlug, fundSlug);
      this.campaignService.search(query as SearchQuery).subscribe({
        next: () => {},
        error: () => {
          this.router.navigateByUrl(`/${campaignSlug}`);
        },
      });
    }

    return this.load(
      campaignSlug || '',
      (identifier: string) => this.campaignService.getOneBySlug(identifier),
    );
  }

  private load(
    identifier: string,
    method: (identifier: string) => Observable<Campaign>,
  ): Observable<Campaign> {
    const observable = method(identifier)
      .pipe(catchError(error => {
        console.log(`CampaignResolver load error: "${error.message}"`);
        // Because it happens server side & before resolution, `replaceUrl` seems not to
        // work, so just fall back to serving the Home content on the requested path.
        this.router.navigateByUrl('/');
        return EMPTY;
      }));

    observable.subscribe(() => {});

    return observable;
  }
}
