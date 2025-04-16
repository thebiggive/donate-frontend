import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ComponentsModule} from "@biggive/components-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IdentityService} from "../identity.service";
import {environment} from "../../environments/environment";
import {EMAIL_REGEXP} from "../validators/patterns";
import {ActivatedRoute, Router} from "@angular/router";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {transferFundsPath} from "../app-routing";
import {WidgetInstance} from "friendly-challenge";
import {flags} from "../featureFlags";
import type {LoginNavigationState} from "../login/login.component";
import {PageMetaService} from '../page-meta.service';
import {NavigationService} from "../navigation.service";
import {BackendError, errorDescription, errorDetails} from "../backendError";
import {addBodyClass, removeBodyClass} from '../bodyStyle';
import {VerifyEmailComponent} from '../verify-email/verify-email.component';
import {EmailVerificationToken} from '../email-verification-token.resolver';
import {MatIcon} from '@angular/material/icon';
import {minPasswordLength} from '../../environments/common';

@Component({
    selector: 'app-register',
  imports: [ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, MatAutocompleteModule, VerifyEmailComponent, MatIcon],
    templateUrl: './register.component.html',
    styleUrl: 'register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('frccaptcha', { static: false })
  protected friendlyCaptcha!: ElementRef<HTMLElement>;
  friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;
  protected readonly transferFundsPath = transferFundsPath;


  protected processing = false;
  protected error?: string;
  registrationForm!: FormGroup;

  protected registerPostDonationForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(minPasswordLength)]),
  });

  private readyToLogIn = false;
  protected errorHtml: SafeHtml | undefined;
  private friendlyCaptchaSolution: string|undefined;
  protected readonly flags = flags;
  private friendlyCaptchaWidget!: WidgetInstance;
  protected redirectPath: string = 'my-account';
  protected loginLink!: string;
  protected verificationLinkSentToEmail? : string;

  protected verificationCodeSupplied?: string;
  protected emailVerificationToken?: EmailVerificationToken;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly identityService: IdentityService,
    private readonly pageMeta: PageMetaService,
    private readonly router: Router,
    private sanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.emailVerificationToken = this.activatedRoute.snapshot.data.emailVerificationToken;
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
  }

  ngOnInit() {
    this.pageMeta.setCommon('Register', 'Register for a Big Give account', null);

    addBodyClass(this.platformId, 'primary-colour');

    this.registrationForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      password: [null, [Validators.required]],
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

    this.loginLink = `/login/?r=` + encodeURIComponent(this.redirectPath);
  }

  async ngAfterViewInit() {
    if (! isPlatformBrowser(this.platformId)) {
      return;
    }

    if (environment.environmentId === 'regression') {
      this.friendlyCaptchaSolution = "dummy-captcha-code";
      return;
    }

    this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.friendlyCaptchaSolution = solution;
      },
      errorCallback: () => {
      },
    });
    await this.friendlyCaptchaWidget.start()
  }

  async register(): Promise<void> {
    this.errorHtml = this.error = undefined;

    if (!this.registrationForm.valid && this.readyToTakeAccountDetails) {

      const emailErrors = this.registrationForm.controls?.emailAddress?.errors;
      const passwordErrors = this.registrationForm.controls?.password?.errors;

      switch (true) {
        case emailErrors?.['required'] && passwordErrors?.['required']:
          this.error = 'Email address and password are required';
          break;
        case emailErrors?.['required']:
          this.error = 'Email address is required';
          break;
        case passwordErrors?.['required']:
          this.error = 'Password is required';
          break;
        case !!emailErrors?.['pattern']:
          this.error = `'${emailErrors!['pattern'].actualValue}' is not a recognised email address`;
          break;
        default:
          this.error = 'Unknown Error - please try again or contact us if this error persists';
      }
      return;
    }

    this.processing = true;
    await this.doRegistrationAndLogin(this.friendlyCaptchaSolution);
  }

  private async doRegistrationAndLogin(captchaResponse: string|undefined = undefined) {
    const emailAddress = (this.verificationCodeSupplied && this.verificationLinkSentToEmail) || this.registrationForm.value.emailAddress;
    const firstName = this.registrationForm.value.firstName;
    const lastName = this.registrationForm.value.lastName;

    if (flags.requireEmailVerification && ! this.verificationCodeSupplied) {
      await this.requestVerificationCode(captchaResponse, emailAddress);
      return;
    }

    this.identityService.create({
      captcha_code: captchaResponse ,
      email_address: emailAddress,
      first_name: firstName,
      last_name: lastName,
      raw_password: this.registrationForm.value.password,
      secretNumber: this.verificationCodeSupplied,
    }).subscribe({
        next: async () => {
          // We can't re-use a captcha code twice, so auto-login won't work right now. For now we just
          // redirect to the login form
          const state: LoginNavigationState = {newAccountRegistration: true};
          await this.router.navigateByUrl("/login" + '?r=' + encodeURIComponent(this.redirectPath), {
            state: state
          })
        },
        error: async (error) => {
          this.extractErrorMessage(error);
          this.friendlyCaptchaWidget.reset()
          await this.friendlyCaptchaWidget.start();
          this.processing = false;
        }
      }
    );
  }

  private async requestVerificationCode(captchaResponse: string | undefined, emailAddress: string) {
    if (!captchaResponse) {
      this.error = 'Captcha error – please try again';
        return;
    }

    const emailErrors = this.registrationForm.controls?.emailAddress?.errors;
    if (emailErrors) {
      // only concerned with email address errors as we are not using other parts of the form for this action.
      if (emailErrors?.['required']) {
        this.error = 'Email address is required';
      } else if (!!emailErrors?.['pattern']) {
        this.error = `'${emailErrors!['pattern'].actualValue}' is not a recognised email address`;
      } else {
        console.error({registrationFormWithErrors: this.registrationForm});
        this.error = 'Unknown Error - please try again or contact us if this error persists';
      }

      this.processing = false;
      return;
    }

    try {
      await this.identityService.requestEmailAuthToken(emailAddress, {captcha_code: captchaResponse});
      this.verificationLinkSentToEmail = emailAddress;
    } catch (error: any) {
      this.extractErrorMessage(error);
    } finally {
      this.friendlyCaptchaWidget.reset();
      await this.friendlyCaptchaWidget.start();
      this.processing = false;
    }
    return
  }

  private login(captchaResponse: string | undefined) {
    if (!captchaResponse) {
      this.error = 'Captcha error – please try again';
      return;
    }

    this.identityService.login({
      captcha_code: captchaResponse,
      email_address: this.registrationForm.value.emailAddress,
      raw_password: this.registrationForm.value.password,
    }).subscribe({
      next: async () => {
        await this.router.navigateByUrl('/' + transferFundsPath);
      },
      error: (error) => {
        this.error = 'Auto login: ' + (error.error.description !== undefined ? error.error.description : error.message) || 'Unknown error';
        this.processing = false;
      }
    });
  }

  async verificationCodeEntered(verificationCode: string) {
    this.processing = true;
    const tokenValid = await this.identityService.checkNewAccountEmailVerificationTokenValid(
      {secret: verificationCode, emailAddress: this.verificationLinkSentToEmail}
    );

    console.log({tokenValid});

    if (! tokenValid) {
      this.error = "Sorry, we couldn't confirm that code. Please try again, or refresh the page and re-enter your email address to generate a new code."
      this.processing = false;
      return;
    }

    this.error = undefined;
    this.verificationCodeSupplied = verificationCode;
    this.processing = false;
  }

  get readyToTakeAccountDetails(): boolean {
    return !!this.verificationCodeSupplied || this.emailVerificationToken?.valid || ! flags.requireEmailVerification
  }

  async registerPostDonation() {
    this.processing = true;
    this.registerPostDonationForm.markAllAsTouched();
    const password = this.registerPostDonationForm.value.password

    const passwordErrors = this.registerPostDonationForm.controls.password.errors;
    if (passwordErrors?.required) {
      this.error = "Password is required"
      this.processing = false
      return;
    }

    try {
      await this.identityService.setFirstPasswordWithToken(password!, this.emailVerificationToken!)
    } catch (error: any) {
      this.extractErrorMessage(error);
      this.processing = false;
      return;
    }

    const state: LoginNavigationState = {newAccountRegistration: true};
    await this.router.navigateByUrl("/login" + '?r=' + encodeURIComponent(this.redirectPath), {
      state: state
    })
    this.processing = false;
  }

  private extractErrorMessage = (error: BackendError) => {
    const errorInfo = errorDetails(error);
    if (errorInfo.htmlDescription) {
      // this HTML can only have come back from our identity server, which we consider trustworthy.
      this.errorHtml = this.sanitizer.bypassSecurityTrustHtml(errorInfo.htmlDescription)
    } else {
      this.error = errorDescription(error);
    }
  }
}
