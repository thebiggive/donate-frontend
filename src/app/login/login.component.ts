import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
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
import {ActivatedRoute, Router} from "@angular/router";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {registerPath} from "../app-routing";

export function isAllowableRedirectPath(redirectParam: string) {
  return ! redirectParam.match(/[^a-zA-Z0-9\-_\/]/);
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, RecaptchaModule, MatAutocompleteModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  @ViewChild('captcha') captcha: RecaptchaComponent;
  protected forgotPassword = false;
  protected loggingIn = false;
  protected loginError?: string;
  loginForm: FormGroup;
  protected userAskedForResetLink = false;
  protected resetPasswordForm: FormGroup;
  protected resetPasswordSuccess: boolean|undefined = undefined;
  protected recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  private redirectPath: string = '/my-account';
  protected passwordResetError: undefined|string = undefined;
  protected readonly registerPath = registerPath;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly identityService: IdentityService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('primary-colour');
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('primary-colour');
    }

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

    const redirectParam = this.activatedRoute.snapshot.queryParams.r as string|undefined;

    // allowed chars in URL to redirect to: a-z, A-Z, 0-9, - _ /
    if (redirectParam && isAllowableRedirectPath(redirectParam)) {
      this.redirectPath = '/' + redirectParam;
    }
  }

  login(): void {
    if (! this.loginForm.valid) {

      const emailErrors = this.loginForm.controls?.emailAddress?.errors;
      const passwordErrors = this.loginForm.controls?.password?.errors;

      switch (true) {
        case emailErrors?.required && passwordErrors?.required:
          this.loginError = 'Email address and password are required';
          break;
        case emailErrors?.required:
          this.loginError = 'Email address is required';
          break;
        case passwordErrors?.required:
          this.loginError = 'Password is required';
          break;
        case !!emailErrors?.pattern:
          this.loginError = `'${emailErrors!.pattern.actualValue}' is not a recognised email address`;
          break;
        default:
          this.loginError = 'Unknown Error - please try again or contact us if this error persists';
      }
      return;
    }

    this.loggingIn = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  resetPasswordClicked(): void {
    this.passwordResetError = undefined;
    if (!this.resetPasswordForm.valid) {
      const emailErrors = this.resetPasswordForm.controls?.emailAddress?.errors;

      switch (true) {
        case emailErrors?.required:
          this.passwordResetError = 'Email address is required';
          break;
        case !!emailErrors?.pattern:
          this.passwordResetError = `'${emailErrors!.pattern.actualValue}' is not a recognised email address`;
          break;
        default:
          this.passwordResetError = 'Unknown Error - please try again or contact us if this error persists';
      }
      return;
    }

    this.userAskedForResetLink = true;
    this.captcha.reset();
    this.captcha.execute();
  }

  captchaError() {
    this.loginError = 'Captcha error – please try again';
    this.loggingIn = false;
  }

  captchaReturn(captchaResponse: string): void {
    this.loginError = undefined;
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
        next: (_response: { id: string, jwt: string }) => {
          this.router.navigateByUrl(this.redirectPath);
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
