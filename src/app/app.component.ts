import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as FontFaceObserver from 'fontfaceobserver';

import { AnalyticsService } from './analytics.service';
import { GetSiteControlService } from './getsitecontrol.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService,
    private getSiteControlService: GetSiteControlService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private router: Router,
  ) {
    // Avoid flash of icon placeholder text. https://github.com/angular/components/issues/12171#issuecomment-546079738
    const materialIcons = new FontFaceObserver('Material Icons');
    materialIcons.load(null, 10000)
      .then(() => this.renderer.addClass(document.body, 'material-icons-loaded'));
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.init();
      this.getSiteControlService.init();
    }
  }

  public onGlobalSearch(term: string) {
    this.router.navigateByUrl(`/search?term=${term}`);
  }
}
