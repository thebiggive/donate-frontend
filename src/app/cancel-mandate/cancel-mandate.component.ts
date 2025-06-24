import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput } from '@biggive/components-angular';
import { Mandate } from '../mandate.model';
import { MoneyPipe } from '../money.pipe';
import { OrdinalPipe } from '../ordinal.pipe';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { PageMetaService } from '../page-meta.service';
import { RegularGivingService } from '../regularGiving.service';
import { BackendError, errorDescription } from '../backendError';
import { Toast } from '../toast.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { addBodyClass, removeBodyClass } from '../bodyStyle';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cancel-mandate',
  imports: [
    BiggiveButton,
    BiggiveHeading,
    BiggivePageSection,
    BiggiveTextInput,
    MoneyPipe,
    OrdinalPipe,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatProgressSpinner,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './cancel-mandate.component.html',
  styleUrl: './cancel-mandate.component.scss',
})
export class CancelMandateComponent implements OnInit, OnDestroy {
  private readonly pageMeta = inject(PageMetaService);
  private readonly regularGivingService = inject(RegularGivingService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toast);

  protected mandate$: Observable<Mandate>;
  protected readonly reasonMaxLength = 500;

  protected reasonFormControl = new FormControl('', [Validators.maxLength(this.reasonMaxLength)]);

  private platformId = inject(PLATFORM_ID);
  protected processing = false;
  private mandateSubscription?: Subscription;

  public constructor() {
    const route = inject(ActivatedRoute);

    this.mandate$ = this.regularGivingService.getActiveMandate(route.snapshot.paramMap.get('mandateId') || '');
  }

  ngOnInit() {
    this.mandateSubscription = this.mandate$.subscribe((mandate) => {
      if (mandate.status === 'cancelled') {
        void this.router.navigateByUrl(`/my-account/regular-giving/${mandate.id}`);
        return;
      }

      this.pageMeta.setCommon('Cancel Regular Giving to ' + mandate.charityName, '', null);
    });

    addBodyClass(this.platformId, 'primary-colour');
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
    this.mandateSubscription?.unsubscribe();
  }

  cancel(mandate: Mandate) {
    this.processing = true;
    this.regularGivingService.cancel(mandate, { cancellationReason: this.reasonFormControl.value || '' }).subscribe({
      next: async () => {
        this.toaster.showSuccess('Your regular donations to ' + mandate.charityName + ' will now stop');
        void this.router.navigateByUrl(`/my-account/regular-giving/${mandate.id}`);
      },
      error: (error: BackendError) => {
        this.toaster.showError(errorDescription(error));
        this.processing = false;
      },
    });
  }
}
