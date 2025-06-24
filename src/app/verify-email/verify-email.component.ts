import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BiggiveButton, BiggiveTextInput } from '@biggive/components-angular';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Toast } from '../toast.service';

const codeLength = 6;

@Component({
  selector: 'app-verify-email',
  imports: [BiggiveButton, BiggiveTextInput, MatInput, MatProgressSpinner, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  protected toaster = inject(Toast);

  @Input({ required: true }) emailAddress!: string;

  // @todo id-47 - work out why this doesn't seem to be updating when value in parent `register` component is updated
  // in case where wrong verification code is entered.
  @Input() error?: string | undefined;

  @Input() processing = false;

  @Output() codeEnteredEvent = new EventEmitter<string>();

  protected emailConfirmationForm = new FormGroup({
    code: new FormControl('', [
      Validators.maxLength(codeLength),
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(codeLength),
    ]),
  });

  protected onFormSubmit() {
    const code = this.emailConfirmationForm.value.code;
    if (!code || !this.emailConfirmationForm.valid) {
      this.toaster.showError('Please enter your six digit verification code');
      return;
    }

    this.codeEnteredEvent.emit(code);
  }
}
