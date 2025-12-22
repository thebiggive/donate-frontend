import { Component, inject, OnInit } from '@angular/core';
import { PageMetaService } from '../../page-meta.service';
import { DatePipe } from '@angular/common';
import { IdentityService } from '../../identity.service';
import { Person } from '../../person.model';
import { Router } from '@angular/router';
import { BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput } from '@biggive/components-angular';
import { flags } from '../../featureFlags';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { minPasswordLength } from '../../../environments/common';

@Component({
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
  providers: [DatePipe],
  imports: [BiggivePageSection, BiggiveHeading, BiggiveButton, ReactiveFormsModule, BiggiveTextInput],
})
export class DeleteAccount implements OnInit {
  private pageMeta = inject(PageMetaService);
  private identityService = inject(IdentityService);
  private router = inject(Router);

  public person!: Person;

  protected countryCode: string | null = null;

  protected form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(minPasswordLength),
    ]),
    accountName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  });

  ngOnInit() {
    this.pageMeta.setCommon('Delete Donor Account');

    this.identityService.getLoggedInPerson().subscribe(async (person: Person | null) => {
      if (!person) {
        await this.router.navigate(['']);
        return;
      }

      this.person = person;
    });
  }

  protected async deleteAccount() {
    alert('To implement - account deletion');
  }

  protected readonly flags = flags;
}
