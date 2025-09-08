import { Component, inject, input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
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
  mailingList = input.required<'donor' | 'charity'>();

  mailingListForm;
  submitted = false;
  showThankYouMessage = false;
  private toast = inject(Toast);

  constructor() {
    this.mailingListForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(35)]],
      lastName: ['', [Validators.required, Validators.maxLength(35)]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      jobTitle: ['', [Validators.maxLength(35)]],
      organisationName: ['', [Validators.maxLength(35)]],
    });
  }

  ngOnInit(): void {
    addBodyClass(this.platformId, 'primary-colour');
    this.pageInitialised = true;

    if (this.mailingList() === 'charity') {
      this.mailingListForm.controls.jobTitle.setValidators([Validators.required, Validators.maxLength(35)]);
    }
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.mailingListForm.invalid) {
      this.toast.showError('Please fill in all required fields and try again');
      return;
    }

    // In a real implementation, this would call an API
    alert(`Actual signup still to implement:
    mailinglist: ${this.mailingList()},
    firstName: ${this.mailingListForm.controls.firstName.value},
    lastName: ${this.mailingListForm.controls.lastName.value},
    emailAddress: ${this.mailingListForm.controls.emailAddress.value},
    jobTitle: ${this.mailingListForm.controls.jobTitle.value},
    organisationName: ${this.mailingListForm.controls.organisationName.value},
    `);

    this.showThankYouMessage = true;
  }
}
