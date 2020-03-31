import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticsService } from './analytics.service';
import { GetSiteControlService } from './getsitecontrol.service';
import { FacebookService } from './facebook.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService,
    private getSiteControlService: GetSiteControlService,
    private facebookService: FacebookService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.init();
      this.facebookService.init();
      this.getSiteControlService.init();
    }
  }

  public onGlobalSearch(term: string) {
    this.router.navigateByUrl(`/search?term=${term}`);
  }
}
