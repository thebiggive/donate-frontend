import { Component, OnInit, inject } from '@angular/core';
import { ComponentsModule } from '@biggive/components-angular';
import { DatePipe } from '@angular/common';
import { Mandate } from '../mandate.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoneyPipe } from '../money.pipe';
import { myRegularGivingPath } from '../app.routes';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RegularGivingService } from '../regularGiving.service';
import { PageMetaService } from '../page-meta.service';

@Component({
  selector: 'app-mandate',
  imports: [ComponentsModule, DatePipe, MoneyPipe, MatProgressSpinner, RouterLink],
  templateUrl: './mandate.component.html',
  styleUrl: './mandate.component.scss',
})
export class MandateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private regularGivingService = inject(RegularGivingService);
  private router = inject(Router);
  private readonly pageMeta = inject(PageMetaService);

  protected mandate!: Mandate;
  protected readonly cancelPath;
  private mandateRefreshTimer: number | undefined;
  private timePageLoaded = new Date();

  /**
   * This page always shows the details of the regular giving mandate but we vary it slightly according to
   * how it's being used - if true then we're confirming thanking someone immediately after they have instructed
   * us to start collecting their donations. If false we're showing them details of those instructions etc at a later
   * date.
   */
  protected isThanksPage;

  constructor() {
    this.mandate = this.route.snapshot.data.mandate;
    this.cancelPath = `/${myRegularGivingPath}/${this.mandate.id}/cancel`;
    this.isThanksPage = !!this.route.snapshot.data['isThanks'];
  }

  async ngOnInit(): Promise<void> {
    if (this.mandate.status === 'pending') {
      this.pollForMandateUpdate();
    }
    if (this.isThanksPage && this.mandateIsOld()) {
      // As the mandate is more than a day old we assume the donor doesn't want to be thanked for setting it up now,
      // they just want to review and/or manage it.
      await this.router.navigateByUrl(`/${myRegularGivingPath}/${this.mandate.id}`);
    }

    const title = this.isThanksPage
      ? 'Thank you! Your Regular Giving to ' + this.mandate.charityName
      : 'Your Regular Giving to ' + this.mandate.charityName;
    this.pageMeta.setCommon(title);
  }

  /**
   * Returns true iff the mandate is more tha one day old.
   * @private
   */
  private mandateIsOld() {
    const activationDate = new Date(this.mandate.schedule.activeFrom);
    const mandateAgeMilliseconds = new Date().valueOf() - activationDate.valueOf();

    return mandateAgeMilliseconds > 24 * 60 * 60 * 1_000;
  }

  private pollForMandateUpdate() {
    this.mandateRefreshTimer = window.setInterval(async () => {
      const updatedMandate = await this.regularGivingService.getActiveMandate(this.mandate.id).toPromise();

      if (updatedMandate && updatedMandate.status !== 'pending') {
        this.mandate = updatedMandate;
        window.clearInterval(this.mandateRefreshTimer);
      }

      if (this.timedOut) {
        window.clearInterval(this.mandateRefreshTimer);
      }
    }, 2_000);
  }

  get timedOut(): boolean {
    const maxPollingTime = 15_000; // 15 seconds

    return this.mandate.status === 'pending' && new Date().getTime() - this.timePageLoaded.getTime() > maxPollingTime;
  }

  get showCancelLink(): boolean {
    if (this.isThanksPage) {
      // We don't want to encourage people to use regular giving as if it was ad-hoc, so we don't present the
      // cancel link directly on the thanks page. If the donor wants to cancel they need to navigate to the
      // non-thanks variant of this page.
      return false;
    }

    // ts checks for exhaustiveness:
    switch (this.mandate.status) {
      case 'active':
        return true;

      case 'cancelled':
        return false;
      case 'pending':
        return false;
      case 'campaign-ended':
        return false;
    }
  }

  get statusMessage(): string | false {
    switch (this.mandate.status) {
      case 'active':
        return false;

      case 'cancelled':
        return 'Regular Donations Cancelled';
      case 'pending':
        return 'Regular Giving agreement pending'; // should never actually be seen
      case 'campaign-ended':
        return `Collections period ended for ${this.mandate.charityName} campaign`;
    }
  }
}
