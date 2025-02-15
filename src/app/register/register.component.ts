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

@Component({
    selector: 'app-register',
    imports: [ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, MatAutocompleteModule],
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
  private readyToLogIn = false;
  protected errorHtml: SafeHtml | undefined;
  private friendlyCaptchaSolution: string|undefined;
  protected readonly flags = flags;
  private friendlyCaptchaWidget!: WidgetInstance;
  protected redirectPath: string = 'my-account';
  protected loginLink!: string;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly identityService: IdentityService,
    private readonly pageMeta: PageMetaService,
    private readonly router: Router,
    private sanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('primary-colour');
    }
  }

  ngOnInit() {
    this.pageMeta.setCommon('Register', 'Register for a Big Give account', null);

    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('primary-colour');
    }

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

  register(): void {
    this.errorHtml = this.error = undefined;

    if (!this.registrationForm.valid) {

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
    this.doRegistrationAndLogin(this.friendlyCaptchaSolution);
  }

  private doRegistrationAndLogin(captchaResponse: string|undefined = undefined) {
    const extractErrorMessage = (error: BackendError) => {
      const errorInfo = errorDetails(error);
      if (errorInfo.htmlDescription) {
        // this HTML can only have come back from our identity server, which we consider trustworthy.
        this.errorHtml = this.sanitizer.bypassSecurityTrustHtml(errorInfo.htmlDescription)
      } else {
        this.error = errorDescription(error);
      }
    }

    this.identityService.create({
      captcha_code: captchaResponse ,
      email_address: this.registrationForm.value.emailAddress,
      first_name: this.registrationForm.value.firstName,
      last_name: this.registrationForm.value.lastName,
    }).subscribe({
        next: initialPerson => {
          // would like to move the line below inside `identityService.create` but that caused test errors when I tried
          this.identityService.saveJWT(initialPerson.id as string, initialPerson.completion_jwt as string);

          initialPerson.raw_password = this.registrationForm.value.password;

          this.identityService.update(initialPerson).subscribe({
            next: async () => {
              // We can't re-use a captcha code twice, so auto-login won't work right now. For now we just
              // redirect to the login form
              const state: LoginNavigationState = {newAccountRegistration: true};
              await this.router.navigateByUrl("/login" + '?r=' + encodeURIComponent(this.redirectPath), {
                state: state
              })
            },
            error: async (error) => {
              extractErrorMessage(error);
              this.friendlyCaptchaWidget.reset()
              await this.friendlyCaptchaWidget.start();
              this.processing = false;
              this.friendlyCaptcha.nativeElement
            }
          });
        },
        error: (error) => {
          extractErrorMessage(error);
          this.friendlyCaptchaWidget.reset()
          this.processing = false;
        }
      }
    );
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
}
