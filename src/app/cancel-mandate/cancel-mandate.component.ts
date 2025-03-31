import {Component, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ComponentsModule} from '@biggive/components-angular';
import {Mandate} from "../mandate.model";
import {MoneyPipe} from '../money.pipe';
import {OrdinalPipe} from '../ordinal.pipe';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {AsyncPipe, isPlatformBrowser} from '@angular/common';
import {PageMetaService} from '../page-meta.service';
import {RegularGivingService} from '../regularGiving.service';
import {BackendError, errorDescription} from '../backendError';
import {Toast} from '../toast.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {addBodyClass, removeBodyClass} from '../bodyStyle';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-cancel-mandate',
  imports: [
    ComponentsModule,
    MoneyPipe,
    OrdinalPipe,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatProgressSpinner,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './cancel-mandate.component.html',
  styleUrl: './cancel-mandate.component.scss'
})
export class CancelMandateComponent implements OnInit, OnDestroy {
  protected mandate$: Observable<Mandate>;
  protected readonly reasonMaxLength = 500;
  protected cancellationForm = new FormGroup({
    reason: new FormControl('', [Validators.maxLength(this.reasonMaxLength)]),
  });

  private platformId = inject(PLATFORM_ID);
  protected processing = false;
  private mandateSubscription?: Subscription;

  public constructor(
    route: ActivatedRoute,
    private readonly pageMeta: PageMetaService,
    private readonly regularGivingService: RegularGivingService,
    private readonly router: Router,
    private readonly toaster: Toast
  ) {
    this.mandate$ = this.regularGivingService.getActiveMandate(route.snapshot.paramMap.get('mandateId') || '');
  }

  ngOnInit() {
    this.mandateSubscription = this.mandate$.subscribe(mandate => {
      console.log({mandate});

      if (mandate.status === 'cancelled') {
        void this.router.navigateByUrl(`/my-account/regular-giving/${mandate.id}`)
        return;
      }

      this.pageMeta.setCommon('Cancel Regular Giving to ' + mandate.charityName, '', null);
    })

    addBodyClass(this.platformId, 'primary-colour');
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
    this.mandateSubscription?.unsubscribe()
  }

  cancel(mandate: Mandate) {
    this.processing = true;
    this.regularGivingService.cancel(mandate, {cancellationReason: this.cancellationForm.controls.reason.value || ''}).subscribe(
      {
        next: async () => {
          this.toaster.showSuccess("Your regular donations to " + mandate.charityName + " will now stop");
          void this.router.navigateByUrl(`/my-account/regular-giving/${mandate.id}`);
        },
        error: (error: BackendError) => {
          this.toaster.showError(errorDescription(error));
          this.processing = false;
        },
      }
    );
  }
}
