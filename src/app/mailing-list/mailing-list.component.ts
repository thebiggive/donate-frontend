import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput } from '@biggive/components-angular';
import { addBodyClass, removeBodyClass } from '../bodyStyle';
import { Toast } from '../toast.service';

/**
 * Mailing list signup component
 */
@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrl: './mailing-list.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput],
})
export class MailingListComponent implements OnInit, OnDestroy {
  /** Used to prevent displaying the page before all parts are ready **/
  public pageInitialised = false;
  private formBuilder = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  mailingListForm;
  submitted = false;
  showThankYouMessage = false;
  private toast = inject(Toast);

  constructor() {
    this.mailingListForm = this.formBuilder.group({
      firstName: ['', Validators.required, Validators.maxLength(35)],
      lastName: ['', Validators.required, Validators.maxLength(35)],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      donorInterest: [false],
      charityInterest: [false],
      organisationName: ['', Validators.required, Validators.maxLength(35)],
      jobTitle: ['', Validators.required, Validators.maxLength(35)],
    });
  }

  ngOnInit(): void {
    addBodyClass(this.platformId, 'primary-colour');
    this.pageInitialised = true;
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.mailingListForm.invalid) {
      const nameErrors = this.mailingListForm.controls.firstName?.errors;
      const emailErrors = this.mailingListForm.controls.emailAddress?.errors;

      const errors: string[] = [];
      if (nameErrors) {
        errors.push('Please enter your first name.');
      }

      if (emailErrors) {
        errors.push('Please enter a valid email address.');
      }

      this.toast.showError(errors.join(' '));

      return;
    }

    // In a real implementation, this would call an API
    console.log('Form submitted', {
      firstName: this.mailingListForm.value.firstName,
      emailAddress: this.mailingListForm.value.emailAddress,
    });

    // Show thank you message
    this.showThankYouMessage = true;
  }
}
