import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput } from '@biggive/components-angular';
import { addBodyClass, removeBodyClass } from '../bodyStyle';

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

  constructor() {
    this.mailingListForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
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

    // Stop here if form is invalid
    if (this.mailingListForm.invalid) {
      console.log(this.mailingListForm);
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
