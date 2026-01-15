import { Component, inject, OnInit } from '@angular/core';
import { BiggiveButton, BiggiveHeading, BiggivePageSection } from '@biggive/components-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { flags } from '../../featureFlags';
import { PageMetaService } from '../../page-meta.service';
import { DonorAccountService } from '../../donor-account.service';
import { Toast } from '../../toast.service';
import { ExactCurrencyPipe } from '../../exact-currency.pipe';

@Component({
  selector: 'app-register',
  imports: [BiggiveButton, BiggiveHeading, BiggivePageSection, MatProgressSpinnerModule, ExactCurrencyPipe],
  templateUrl: './withdraw-funds.component.html',
  styleUrl: 'withdraw-funds.component.scss',
})
export class WithdrawFundsComponent implements OnInit {
  private readonly pageMeta = inject(PageMetaService);

  protected processing = false;
  protected error?: string;
  private route = inject(ActivatedRoute);
  protected person = this.route.snapshot.data.person;
  protected readonly flags = flags;
  private donorAccountService = inject(DonorAccountService);
  private toaster = inject(Toast);
  protected actioned = false;

  ngOnInit() {
    this.pageMeta.setCommon('Withdraw Funds', 'Register for a Big Give account', null);
  }

  get hasDonationFunds(): boolean {
    return !!this.person.cash_balance?.gbp;
  }

  protected async withdrawFunds() {
    this.processing = true;
    try {
      await this.donorAccountService.withdrawAllFunds();
      // @ts-expect-error - treating the error as BackendError instead of unknown.
    } catch (e: BackendError) {
      this.toaster.showError(
        'Failed to withdraw funds due to an unexpected error - please contact Big Give for any assistance',
      );
      console.error(e);
    }
    this.processing = false;
    this.actioned = true;
  }
}
