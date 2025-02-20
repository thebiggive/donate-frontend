import {Component, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentsModule} from '@biggive/components-angular';
import {Mandate} from "../mandate.model";
import {MoneyPipe} from '../money.pipe';
import {OrdinalPipe} from '../ordinal.pipe';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {isPlatformBrowser} from '@angular/common';
import {PageMetaService} from '../page-meta.service';
import {RegularGivingService} from '../regularGiving.service';
import {BackendError, errorDescription} from '../backendError';
import {Toast} from '../toast.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {addBodyClass, removeBodyClass} from '../bodyStyle';

@Component({
  selector: 'app-cancel-mandate',
  imports: [
    ComponentsModule,
    MoneyPipe,
    OrdinalPipe,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatProgressSpinner
  ],
  templateUrl: './cancel-mandate.component.html',
  styleUrl: './cancel-mandate.component.scss'
})
export class CancelMandateComponent implements OnInit, OnDestroy {
  protected mandate: Mandate;
  protected readonly reasonMaxLength = 500;
  protected cancellationForm = new FormGroup({
    reason: new FormControl('', [Validators.maxLength(this.reasonMaxLength)]),
  });

  private platformId = inject(PLATFORM_ID);
  protected processing = false;

  public constructor(
    route: ActivatedRoute,
    private readonly pageMeta: PageMetaService,
    private readonly regularGivingService: RegularGivingService,
    private readonly router: Router,
    private readonly toaster: Toast
  ) {
    this.mandate = route.snapshot.data.mandate;
  }

  ngOnInit() {
    this.pageMeta.setCommon('Cancel Regular Giving to ' + this.mandate.charityName, '', null);
    addBodyClass(this.platformId, 'primary-colour');
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
  }

  cancel(mandate: Mandate) {
    this.processing = true;
    this.regularGivingService.cancel(mandate, {cancellationReason: this.cancellationForm.controls.reason.value || ''}).subscribe(
      {
        next: async () => {
          this.toaster.showSuccess("Your regular donations to " + this.mandate.charityName + " will now stop");
          void this.router.navigateByUrl(`/my-account/regular-giving/${this.mandate.id}`);
        },
        error: (error: BackendError) => {
          this.toaster.showError(errorDescription(error));
          this.processing = false;
        },
      }
    );
  }
}
