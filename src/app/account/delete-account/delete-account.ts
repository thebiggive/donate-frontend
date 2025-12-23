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
import { Toast } from '../../toast.service';

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
  private toast = inject(Toast);

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
  protected deleted = false;

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
    const password = this.form.value.password;

    if (!password) {
      this.toast.showError('Please provide your password to delete your account');
      return;
    }

    const actualAccountName = this.person.first_name + ' ' + this.person.last_name;

    if (this.form.value.accountName !== actualAccountName) {
      this.toast.showError('Please enter your account name exactly as shown to delete your account');
      return;
    }

    try {
      await this.identityService.deleteAccount(this.person, { password });
      this.deleted = true;
      // @ts-expect-error - treating the error as BackendError instead of unknown.
    } catch (e: BackendError) {
      const description: string = e.error.error.description;
      if (description.includes('password')) {
        this.toast.showError(
          'Your password did not match our records. Please try again, or log out and use the reset password feature',
        );
        return;
      }

      console.error(e);
      this.toast.showError('An error occurred while deleting your account. Please try again later.');
    }
  }

  protected readonly flags = flags;
}
