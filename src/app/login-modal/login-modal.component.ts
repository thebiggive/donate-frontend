import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';

@Component({
  standalone: true,
  selector: 'app-login-modal',
  templateUrl: 'login-modal.html',
  styleUrls: ['./login-modal.component.scss'],
  imports: [
    ...allChildComponentImports,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
})
export class LoginModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  loginForm: FormGroup;
  loggingIn = false;
  loginError?: string;
  forgotPassword = false;
  resetPasswordForm: FormGroup;
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
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
    });

    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.email,
      ]],
    });
  }

  captchaReturn(captchaResponse: string) {
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
        this.identityService.saveJWT(response.id, response.jwt);
        this.dialogRef.close(response);
        this.loggingIn = false;
      }, (error) => {
        this.captcha.reset();
        this.loginError = (error.error.description !== undefined ? error.error.description : error.message) || 'Unknown error';
        this.loggingIn = false;
      });
    }

    else if (this.userAskedForResetLink) {
      this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress).subscribe((response) => {
        // console.log(response);
        // console.log(response.id);
        // console.log(response.jwt);
        // this.identityService.saveJWT(response.id, response.jwt);
        // this.dialogRef.close(response);
        // this.userAskedForResetLink = false;
      }, (error) => {
        // Do NOT surface any error for security reasons. Let the user see the message to check their email for the
        // password reset link, even if the email entered was invalid. This helps ensure we do not surface any
        // information.

        // this.captcha.reset();
        // this.resetPasswordError = (error.error.description !== undefined ? error.error.description : error.message) || 'Unknown error';
        // console.log(error);
        // this.userAskedForResetLink = false;
      });
    }
  }

  login() {
    this.loggingIn = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  sendPasswordResetLink() {
    this.userAskedForResetLink = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  forgotPasswordClicked() {
    this.forgotPassword = true;
  }
}
