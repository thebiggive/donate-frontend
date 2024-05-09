import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';
import { EMAIL_REGEXP } from '../validators/patterns';
import {PopupStandaloneComponent} from "../popup-standalone/popup-standalone.component";

@Component({
  standalone: true,
  selector: 'app-login-modal',
  templateUrl: 'login-modal.html',
  styleUrl: './login-modal.component.scss',
  imports: [
    ...allChildComponentImports,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RecaptchaModule,
    PopupStandaloneComponent,
  ],
})
export class LoginModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  loginForm: FormGroup;
  loggingIn = false;
  loginError?: string;
  forgotPassword = false;
  resetPasswordForm: FormGroup;
  resetPasswordSuccess: boolean|undefined = undefined;
  userAskedForResetLink = false;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;

  constructor(
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP),
      ]],
      password: [null, [
        Validators.required,
      ]],
    });

    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP),
      ]],
    });
  }

  captchaError() {
    this.loginError = 'Captcha error – please try again';
    this.loggingIn = false;
  }

  captchaReturn(captchaResponse: string | null): void {
    if (captchaResponse === null) {
      // We had a code but now don't, e.g. after expiry at 1 minute. In this case
      // the trigger wasn't a login click so do nothing. A repeat login attempt will
      // re-execute the captcha in `login()`.
      return;
    }

    if (this.loggingIn) {
      const credentials: Credentials = {
        captcha_code: captchaResponse,
        email_address: this.loginForm.value.emailAddress,
        raw_password: this.loginForm.value.password,
      };

      this.identityService.login(credentials).subscribe((response: { id: string, jwt: string }) => {
        this.dialogRef.close(response);
        this.loggingIn = false;
      }, (error) => {
        this.captcha.reset();
        const errorDescription = error.error.error.description;
        this.loginError = errorDescription || error.message || 'Unknown error';
        this.loggingIn = false;
      });
    }

    else if (this.userAskedForResetLink) {
      this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, captchaResponse).subscribe({
        next: _ => this.resetPasswordSuccess = true,
        error: _ => this.resetPasswordSuccess = false,
      });
    }
  }

  login(): void {
    this.loggingIn = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  resetPasswordClicked(): void {
    this.userAskedForResetLink = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  forgotPasswordClicked(): void {
    this.forgotPassword = true;
  }
}
