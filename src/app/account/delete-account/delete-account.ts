import { Component, inject, OnInit, signal } from '@angular/core';
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
import { environment } from '../../../environments/environment';

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
  protected environment = environment;

  public person!: Person;

  protected countryCode: string | null = null;
  protected readonly showPassword = signal(false);

  protected form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(minPasswordLength),
    ]),
    accountName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  });
  protected deleted = false;
  protected fullName: string | undefined;

  ngOnInit() {
    this.pageMeta.setCommon('Delete Donor Account');

    this.identityService.getLoggedInPerson().subscribe(async (person: Person | null) => {
      if (!person) {
        await this.router.navigate(['']);
        return;
      }

      this.person = person;
      this.fullName = this.normaliseName(person.first_name + ' ' + person.last_name);
    });
  }

  protected async deleteAccount() {
    const password = this.form.value.password;

    if (!password) {
      this.toast.showError('Please provide your password to delete your account');
      return;
    }

    if (this.showPassword()) {
      this.showPassword.set(false);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (this.normaliseName(this.form.value.accountName) !== this.fullName) {
      this.toast.showError('Please enter your account name exactly as shown to delete your account');
      console.log('Account name mismatch:', { formValue: this.form.value.accountName, fullName: this.fullName });
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

  /**
   * Remove leading trailing and repeated whitespace to make it easier to match typed with expected name and
   * avoid displaying a spurious space.
   */
  private normaliseName(name: null | undefined | string) {
    return name?.trim()?.replace(/\s+/g, ' ');
  }

  protected readonly flags = flags;

  protected toggleShowPassword() {
    this.showPassword.update((current) => !current);
  }
}
