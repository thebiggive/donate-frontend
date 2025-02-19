import {Component, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ComponentsModule} from '@biggive/components-angular';
import {Mandate} from "../mandate.model";
import {MoneyPipe} from '../money.pipe';
import {OrdinalPipe} from '../ordinal.pipe';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {isPlatformBrowser} from '@angular/common';
import {PageMetaService} from '../page-meta.service';

@Component({
  selector: 'app-cancel-mandate',
  imports: [
    ComponentsModule,
    MoneyPipe,
    OrdinalPipe,
    FormsModule,
    MatInput,
    ReactiveFormsModule
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

  public constructor(
    route: ActivatedRoute,
    private readonly pageMeta: PageMetaService,
  ) {
    this.mandate = route.snapshot.data.mandate;
  }

  ngOnInit() {
    this.pageMeta.setCommon('Cancel Regular Giving to ' + this.mandate.charityName, '', null);
    if (isPlatformBrowser(this.platformId)) {
      console.log("setting body to primary colour");
      document.body.classList.add('primary-colour');
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('primary-colour');
    }
  }

  cancel(mandate: Mandate) {
    alert("To implement: cancel " + mandate.id + ' because ' + this.cancellationForm.controls.reason.value);
  }
}
