import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
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
import {flags} from "../featureFlags";
import {WidgetInstance} from "friendly-challenge";

export function isAllowableRedirectPath(redirectParam: string) {
  return ! redirectParam.match(/[^a-zA-Z0-9\-_\/]/);
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, RecaptchaModule, MatAutocompleteModule],
  templateUrl: './login.component.html',
  styleUrl: 'login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('captcha') captcha: RecaptchaComponent | undefined;

  @ViewChild('frccaptcha', { static: false })
  friendlyCaptcha: ElementRef<HTMLElement>|undefined;

  protected forgotPassword = false;
  protected loggingIn = false;
  protected loginError?: string;
  loginForm: FormGroup;
  protected userAskedForResetLink = false;
  protected resetPasswordForm: FormGroup;
  protected resetPasswordSuccess: boolean|undefined = undefined;
  protected recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;

  private redirectPath: string = '/my-account';
  protected passwordResetError: undefined|string = undefined;
  protected readonly registerPath = registerPath;

  /** Used to prevent displaying the page before all parts are ready **/
  public pageInitialised = false;
  private captchaCode: string | undefined;

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

    this.pageInitialised = true;
  }

  ngAfterViewInit() {
    if (! isPlatformBrowser(this.platformId)) {
      return
    }

    if (! this.friendlyCaptcha) {
      return;
    }

    const widget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.captchaCode = solution + "no";
      },
      errorCallback: (error: unknown) => {
        this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
        console.error(error);
      },
    })

    widget.start()
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
   if (!this.captchaCode) {
      this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
      this.loggingIn = false;
      return;
    }
    this.doLogin({
      captcha_code: this.captchaCode,
      captcha_type: 'friendly_captcha',
      email_address: this.loginForm.value.emailAddress,
      raw_password: this.loginForm.value.password,
    });
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
    if (! this.captchaCode) {
      this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
      return;
    }
   this.doLogin({
     captcha_code: this.captchaCode,
     captcha_type: 'friendly_captcha',
     email_address: this.loginForm.value.emailAddress,
     raw_password: this.loginForm.value.password,
   });
  }

  captchaError() {
    this.loginError = 'Captcha error – please try again';
    this.loggingIn = false;
  }

  captchaReturn(captchaResponse: string | null): void {
    this.loginError = undefined;
    if (captchaResponse === null) {
      // We had a code but now don't, e.g. after expiry at 1 minute. In this case
      // the trigger wasn't a login click so do nothing. A repeat login attempt will
      // re-execute the captcha in `login()`.
      return;
    }

    if (this.loggingIn) {
      const captcha_code = captchaResponse;
      const captcha_type = 'recaptcha';
      this.doLogin({
        captcha_code,
        captcha_type,
        email_address: this.loginForm.value.emailAddress,
        raw_password: this.loginForm.value.password,
      });
    }

    else if (this.userAskedForResetLink) {
      this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, captchaResponse).subscribe({
        next: _ => this.resetPasswordSuccess = true,
        error: _ => this.resetPasswordSuccess = false,
      });
    }
  }

  private doLogin(credentials: Credentials) {
    this.identityService.login(credentials).subscribe({
      next: (_response: { id: string, jwt: string }) => {
        this.router.navigateByUrl(this.redirectPath);
      },
      error: (error) => {
        this.captcha?.reset();
        const errorDescription = error.error.error.description;
        this.loginError = errorDescription || error.message || 'Unknown error';

        this.loggingIn = false;
      }
    });
  }

  protected readonly flags = flags;
}
