import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComponentsModule} from "@biggive/components-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RecaptchaComponent, RecaptchaModule} from "ng-recaptcha";
import {Credentials} from "../credentials.model";
import {IdentityService} from "../identity.service";
import {environment} from "../../environments/environment";
import {EMAIL_REGEXP} from "../validators/patterns";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('captcha') captcha: RecaptchaComponent;
  protected forgotPassword = false;
  protected loggingIn = false;
  protected loginError?: string;
  loginForm: FormGroup;
  protected userAskedForResetLink = false;
  protected resetPasswordForm: FormGroup;
  protected resetPasswordSuccess: boolean|undefined = undefined;
  protected recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;


  constructor(
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP),
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
    });

    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP),
      ]],
    });
  }

  login(): void {
    this.loggingIn = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  forgotPasswordClicked(): void {
    this.forgotPassword = true;
  }

  resetPasswordClicked(): void {
    this.userAskedForResetLink = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  captchaError() {
    this.loginError = 'Captcha error – please try again';
    this.loggingIn = false;
  }

  captchaReturn(captchaResponse: string): void {
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

      this.identityService.login(credentials).subscribe({
        next: (response: { id: string, jwt: string }) => {
          this.identityService.saveJWT(response.id, response.jwt);
          this.loggingIn = false;
        },
        error: (error) => {
          this.captcha.reset();
          const errorDescription = error.error.error.description;
          this.loginError = errorDescription || error.message || 'Unknown error';
          this.loggingIn = false;
      }});
    }

    else if (this.userAskedForResetLink) {
      this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, captchaResponse).subscribe({
        next: _ => this.resetPasswordSuccess = true,
        error: _ => this.resetPasswordSuccess = false,
      });
    }
  }
}
