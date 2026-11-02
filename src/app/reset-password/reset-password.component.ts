import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { getPasswordValidator } from '../validators/validate-passwords-same';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { minPasswordLength } from '../../environments/common';
import { BiggiveHeading } from '@biggive/components-angular';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { PasswordInputComponent } from '../password-input/password-input.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [BiggiveHeading, MatProgressSpinner, ReactiveFormsModule, MatButton, PasswordInputComponent],
})
export class ResetPasswordComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  minPasswordLength: number;
  passwordForm!: FormGroup;
  savingNewPassword: boolean = false;
  saveSuccessful: boolean | undefined = undefined;
  errorMessageHtml: string | undefined;
  token!: string;
  tokenValid: boolean | undefined = undefined;

  constructor() {
    this.minPasswordLength = minPasswordLength;
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(10)]],
      confirmPassword: [null, [Validators.required]],
    });

    this.passwordForm.controls.password.valueChanges.subscribe((password) => {
      if (this.passwordForm.controls.confirmPassword.dirty) {
        this.passwordForm.controls.confirmPassword.setValidators([
          Validators.required,
          Validators.minLength(10),
          getPasswordValidator(password ?? undefined),
        ]);
        this.passwordForm.controls.confirmPassword.updateValueAndValidity();
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.token = params.token;
      this.identityService.checkTokenValid(this.token).subscribe({
        // @ts-expect-error: Not sure how to make subscribe() happy with the type narrowing
        next: (response: { valid: boolean }) => {
          this.tokenValid = response.valid;
          this.cdr.markForCheck();
        },
        error: () => {
          this.tokenValid = false;
          this.cdr.markForCheck();
        },
      });
      if (!this.token) {
        void this.router.navigate(['']);
      }
    });
  }

  get confirmPasswordField() {
    if (!this.passwordForm) {
      return undefined;
    }
    return this.passwordForm.controls.confirmPassword;
  }

  saveNewPassword = async () => {
    this.savingNewPassword = true;
    this.cdr.markForCheck();
    this.identityService.resetPassword(this.passwordForm.controls.password!.value, this.token).subscribe({
      next: (_) => {
        this.savingNewPassword = false;
        this.errorMessageHtml = undefined;
        this.saveSuccessful = true;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.savingNewPassword = false;
        this.saveSuccessful = false;
        this.errorMessageHtml = error.error?.error?.description;
        this.cdr.markForCheck();
      },
    });
  };

  onPasswordConfirmationFocus = () => {
    this.passwordForm
      .get('confirmPassword')
      ?.setValidators([
        Validators.required,
        Validators.minLength(10),
        getPasswordValidator(this.passwordForm.controls.password!.value),
      ]);
  };
}
