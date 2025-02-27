import {Component, OnInit} from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {Mandate} from "../mandate.model";
import {ActivatedRoute} from "@angular/router";
import {MoneyPipe} from "../money.pipe";
import {myRegularGivingPath} from '../app-routing';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { RegularGivingService } from '../regularGiving.service';

@Component({
    selector: 'app-mandate',
  imports: [
    ComponentsModule,
    DatePipe,
    MoneyPipe,
    MatProgressSpinner
  ],
    templateUrl: './mandate.component.html',
    styleUrl: './mandate.component.scss'
})

export class MandateComponent implements OnInit {
  protected mandate!: Mandate;
  protected readonly cancelPath;
  private mandateRefreshTimer: number|undefined;
  private timePageLoaded = new Date();

  constructor(
    private route: ActivatedRoute,
    private regularGivingService: RegularGivingService,
  ) {
    this.mandate = this.route.snapshot.data.mandate;
    this.cancelPath = `/${myRegularGivingPath}/${this.mandate.id}/cancel`;
  }

  ngOnInit(): void {
    if (this.mandate.status === 'pending') {
      this.pollForMandateUpdate();
    }
  }

  private pollForMandateUpdate() {
    this.mandateRefreshTimer = window.setInterval(
      async () => {
        const updatedMandate = await this.regularGivingService.getActiveMandate(this.mandate.id).toPromise();

        if (updatedMandate && updatedMandate.status !== 'pending') {
          this.mandate = updatedMandate;
          window.clearInterval(this.mandateRefreshTimer);
        }

        if (this.timedOut) {
          window.clearInterval(this.mandateRefreshTimer);
        }
      },
      2_000
    )
  }

  get timedOut(): boolean
  {
    const maxPollingTime = 15_000; // 15 seconds

    return this.mandate.status === 'pending' && ((new Date().getTime() - this.timePageLoaded.getTime()) > maxPollingTime);
  }

  get showCancelLink(): boolean
  {
    // ts checks for exhaustiveness:
    switch (this.mandate.status) {
      case 'active': return true;

      case 'cancelled': return false;
      case 'pending': return false;
      case 'campaign-ended': return false;
    }
  }

  get statusMessage(): string|false
  {
    switch (this.mandate.status) {
      case 'active': return false;

      case 'cancelled': return 'Regular Donations Cancelled';
      case 'pending': return 'Regular Giving agreement pending'; // should never actually be seen
      case 'campaign-ended': return `Collections period ended for ${this.mandate.charityName} campaign`;
    }
  }
}
