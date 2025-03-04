import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ComponentsModule} from "@biggive/components-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IdentityService} from "../identity.service";
import {PageMetaService} from '../page-meta.service';
import {environment} from "../../environments/environment";
import {EMAIL_REGEXP} from "../validators/patterns";
import {ActivatedRoute, Router} from "@angular/router";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {registerPath} from "../app-routing";
import {WidgetInstance} from "friendly-challenge";
import {NavigationService} from "../navigation.service";
import {errorDescription, BackendError} from "../backendError";
import {addBodyClass, removeBodyClass} from '../bodyStyle';

export type LoginNavigationState = {
  /**
   * True if we came here as a redirect from the registration form.
   */
  newAccountRegistration?: boolean
}

@Component({
    selector: 'app-login',
    imports: [ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, MatAutocompleteModule],
    templateUrl: './login.component.html',
    styleUrl: 'login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('frccaptcha', { static: false })
  friendlyCaptcha: ElementRef<HTMLElement>|undefined;

  protected forgotPassword = false;
  protected loggingIn = false;
  protected loginError?: string;
  loginForm!: FormGroup;
  protected resetPasswordForm!: FormGroup;
  protected resetPasswordSuccess: boolean|undefined = undefined;
  protected readonly friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;

  protected redirectPath: string = '/my-account';
  protected passwordResetError: undefined|string = undefined;
  protected readonly registerPath = registerPath;

  protected userAskedForResetLink: boolean = false;

  /** Used to prevent displaying the page before all parts are ready **/
  public pageInitialised = false;
  private captchaCode: string | undefined;
  protected registerLink!: string;
  protected isNewRegistration: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly identityService: IdentityService,
    private readonly pageMeta: PageMetaService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    const state: LoginNavigationState = <LoginNavigationState>this.router.getCurrentNavigation()?.extras.state;
    this.isNewRegistration = !!state?.newAccountRegistration;
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
  }

  ngOnInit() {
    this.pageMeta.setCommon('Login', 'Login to your Big Give account', null);

    addBodyClass(this.platformId, 'primary-colour');

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
    if (redirectParam && NavigationService.isAllowableRedirectPath(redirectParam)) {
      this.redirectPath = NavigationService.normaliseRedirectPath(redirectParam);
    }

    this.registerLink = `/${registerPath}?r=` + encodeURIComponent(this.redirectPath);

    this.pageInitialised = true;
  }

  private friendlyCaptchaWidget!: WidgetInstance;

  async ngAfterViewInit() {
    if (! isPlatformBrowser(this.platformId)) {
      return
    }

    if (environment.environmentId === 'regression') {
      this.captchaCode = 'dummy-captcha-code';
      return;
    }

    if (! this.friendlyCaptcha) {
      return;
    }

    this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.captchaCode = solution;
      },
      errorCallback: (error: unknown) => {
        this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
        console.error(error);
      },
    });

    await this.friendlyCaptchaWidget.start()
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


   if (!this.captchaCode) {
      this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
      this.loggingIn = false;
      return;
    }

    this.identityService.login({
      captcha_code: this.captchaCode,
      email_address: this.loginForm.value.emailAddress,
      raw_password: this.loginForm.value.password,
    }).subscribe({
      next: async (_response: { id: string, jwt: string }) => {
        await this.router.navigateByUrl(this.redirectPath);
      },
      error: async (error: BackendError) => {
        this.loginError = errorDescription(error)
        this.loggingIn = false;

        this.captchaCode = undefined;
        this.friendlyCaptchaWidget.reset();
        await this.friendlyCaptchaWidget.start();
      }
    });
    this.loggingIn = true;
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

    if (! this.captchaCode) {
      this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
      return;
    }

    this.userAskedForResetLink = true;
    this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, this.captchaCode).subscribe({
      next: _ => this.resetPasswordSuccess = true,
      error: _ => this.resetPasswordSuccess = false,
    });
  }
}
