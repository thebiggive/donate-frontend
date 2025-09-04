import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  BiggiveButton,
  BiggiveHeading,
  BiggivePageSection,
  BiggiveTextInput
} from '@biggive/components-angular';

/**
 * Mailing list signup component
 */
@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrl: './mailing-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BiggiveButton,
    BiggiveHeading,
    BiggivePageSection,
    BiggiveTextInput
  ]
})
export class MailingListComponent {
  private formBuilder = inject(FormBuilder);

  mailingListForm: FormGroup;
  submitted = false;
  showThankYouMessage = false;

  // Campaign interest checkboxes
  campaigns = [
    { id: 'christmas', name: 'Christmas Challenge', checked: false },
    { id: 'green', name: 'Green Match Fund', checked: false },
    { id: 'arts', name: 'Arts for Impact', checked: false },
    { id: 'women', name: 'Women and Girls Match Fund', checked: false }
  ];

  constructor() {
    this.mailingListForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Toggle campaign selection
   */
  toggleCampaign(index: number): void {
    this.campaigns[index].checked = !this.campaigns[index].checked;
  }

  /**
   * Submit the form
   */
  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.mailingListForm.invalid) {
      return;
    }

    // In a real implementation, this would call an API
    console.log('Form submitted', {
      ...this.mailingListForm.value,
      campaigns: this.campaigns.filter(c => c.checked).map(c => c.name)
    });

    // Show thank you message
    this.showThankYouMessage = true;
  }
}
