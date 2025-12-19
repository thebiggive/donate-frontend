import { Component, inject, OnInit } from '@angular/core';
import { PageMetaService } from '../../page-meta.service';
import { DatePipe } from '@angular/common';
import { IdentityService } from '../../identity.service';
import { OVERSEAS, Person } from '../../person.model';
import { Router } from '@angular/router';
import {
  BiggiveButton,
  BiggiveFormFieldSelect,
  BiggiveHeading,
  BiggivePageSection,
  BiggiveTextInput,
} from '@biggive/components-angular';
import { flags } from '../../featureFlags';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { firstValueFrom } from 'rxjs';
import { countryOptions } from '../../countries';

@Component({
  selector: 'app-my-account',
  templateUrl: './edit-home-address.component.html',
  styleUrl: './edit-home-address.component.scss',
  providers: [DatePipe],
  imports: [
    BiggivePageSection,
    BiggiveHeading,
    BiggiveButton,
    MatCheckbox,
    ReactiveFormsModule,
    BiggiveFormFieldSelect,
    BiggiveTextInput,
  ],
})
export class EditHomeAddress implements OnInit {
  private pageMeta = inject(PageMetaService);
  private identityService = inject(IdentityService);
  private router = inject(Router);

  public person!: Person;

  protected countryOptionsObject = countryOptions;

  protected countryCode: string | null = null;

  protected form = new FormGroup({
    home_address_line_1: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    postcode: new FormControl('', [Validators.required, Validators.maxLength(8)]),
  });

  ngOnInit() {
    this.pageMeta.setCommon('My Home Address');

    this.identityService.getLoggedInPerson().subscribe(async (person: Person | null) => {
      if (!person) {
        await this.router.navigate(['']);
        return;
      }

      this.person = person;

      this.form.patchValue({
        home_address_line_1: person.home_address_line_1,
        postcode: person.home_postcode,
      });

      if (person.home_country_code !== OVERSEAS && person.home_country_code) {
        this.countryCode = person.home_country_code;
      } else {
        this.countryCode = 'GB'; // most likely, most useful as a default value.
      }
    });
  }

  public setSelectedCountry = (countryCode: string) => {
    this.countryCode = countryCode;
  };

  protected async saveChanges() {
    this.person.home_address_line_1 = this.form.controls.home_address_line_1.value || undefined;
    this.person.home_postcode = this.form.controls.postcode.value || undefined;
    this.person.home_country_code = this.countryCode ?? undefined;

    await firstValueFrom(this.identityService.update(this.person));

    await this.router.navigate(['/my-account/']);
  }

  protected readonly flags = flags;
}
