import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ComponentsModule} from '@biggive/components-angular';
import {MatInput} from '@angular/material/input';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Toast} from '../toast.service';

const codeLength = 6;

@Component({
  selector: 'app-verify-email',
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    MatInput,
    MatProgressSpinner
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  protected toaster = inject(Toast);

  @Input({required: true}) emailAddress!: string;

  @Input() processing = false

  @Output() codeEnteredEvent = new EventEmitter<string>();

  protected emailConfirmationForm = new FormGroup({
    code: new FormControl(
      '',
      [
        Validators.maxLength(codeLength),
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(codeLength)
    ]),
  });

  protected onFormSubmit(){
    const code = this.emailConfirmationForm.value.code;
    if (! code || !this.emailConfirmationForm.valid) {
      this.toaster.showError("Please enter your six digit verification code");
      return;
    }

    this.codeEnteredEvent.emit(code);
  }
}
