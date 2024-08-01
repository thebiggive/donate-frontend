import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {ComponentsModule} from "@biggive/components-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RecaptchaComponent, RecaptchaModule} from "ng-recaptcha";
import {IdentityService} from "../identity.service";
import {environment} from "../../environments/environment";
import {EMAIL_REGEXP} from "../validators/patterns";
import {Router} from "@angular/router";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {transferFundsPath} from "../app-routing";
import {WidgetInstance} from "friendly-challenge";
import {flags} from "../featureFlags";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ComponentsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, RecaptchaModule, MatAutocompleteModule],
  templateUrl: './register.component.html',
  styleUrl: 'register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;
  @ViewChild('frccaptcha', { static: false })
  protected friendlyCaptcha: ElementRef<HTMLElement>;

  protected processing = false;
  protected error?: string;
  registrationForm: FormGroup;
  protected recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  private readyToLogIn = false;
  protected errorHtml: SafeHtml | undefined;
  private friendlyCaptchaSolution: string|undefined;
  protected readonly flags = flags;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly identityService: IdentityService,
    private readonly router: Router,
    private sanitizer: DomSanitizer,
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

    this.registrationForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      emailAddress: [null, [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP),
      ]],
    });
  }

  ngAfterViewInit() {
    if (! flags.friendlyCaptchaEnabled) {
      return;
    }

    if (! isPlatformBrowser(this.platformId)) {
      return;
    }

    const widget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.friendlyCaptchaSolution = solution;
        console.log('DONE: ', solution);
      },
      errorCallback: (b) => {
        console.log('FAILED', b);
      },
    })

    widget.start()
  }

  register(): void {
    this.errorHtml = this.error = undefined;

    if (!this.registrationForm.valid) {

      const emailErrors = this.registrationForm.controls?.emailAddress?.errors;
      const passwordErrors = this.registrationForm.controls?.password?.errors;

      switch (true) {
        case emailErrors?.required && passwordErrors?.required:
          this.error = 'Email address and password are required';
          break;
        case emailErrors?.required:
          this.error = 'Email address is required';
          break;
        case passwordErrors?.required:
          this.error = 'Password is required';
          break;
        case !!emailErrors?.pattern:
          this.error = `'${emailErrors!.pattern.actualValue}' is not a recognised email address`;
          break;
        default:
          this.error = 'Unknown Error - please try again or contact us if this error persists';
      }
      return;
    }

    this.processing = true;
    if (! this.flags.friendlyCaptchaEnabled) {
      this.captcha.reset();
      this.captcha.execute();
      return;
    }

    this.doRegistrationAndLogin()
  }

  captchaError() {
    this.error = 'Captcha error – please try again';
    this.processing = false;
  }

  /**
   * Copied from RegisterModalComponent.captchaReturn . I'm not sure if there is any real duplication here that could
   * be DRYed up, but I'm not too b othered about it anyway as I think we will delete that component when or just after
   * this one is released.
   *
   * @param captchaResponse
   */
  captchaReturn(captchaResponse: string | null) {
    if (captchaResponse === null) {
      // We had a code but now don't, e.g. after expiry at 1 minute. In this case
      // the trigger wasn't a register click so do nothing. A repeat register attempt will
      // re-execute the captcha in `register()`.
      return;
    }

    if (this.readyToLogIn) {
      this.identityService.login({
        captcha_code: captchaResponse,
        email_address: this.registrationForm.value.emailAddress,
        raw_password: this.registrationForm.value.password,
      }).subscribe({
        next: () => {
          this.router.navigateByUrl('/' + transferFundsPath);
        },
        error: (error) => {
          this.captcha.reset();
          this.error = 'Auto login: ' + (error.error.description !== undefined ? error.error.description : error.message) || 'Unknown error';
          this.processing = false;
        }
      });

      return;
    }

    this.doRegistrationAndLogin(captchaResponse);
  }

  private doRegistrationAndLogin(captchaResponse: string|undefined = undefined) {
    const extractErrorMessage = (error: {
      error: { error: { description?: string, htmlDescription?: string } },
      message?: string
    }) => {
      const errorInfo = error.error.error;
      if (errorInfo.htmlDescription) {
        // this HTML can only have come back from our identity server, which we consider trustworthy.
        this.errorHtml = this.sanitizer.bypassSecurityTrustHtml(errorInfo.htmlDescription)
      } else {
        this.error = errorInfo.description || error.message || 'Unknown error';
      }
    }

    const captchaType = this.friendlyCaptchaSolution ? 'friendly_captcha' : 'recaptcha';
    captchaResponse = this.friendlyCaptchaSolution ?? captchaResponse;

    this.identityService.create({
      captcha_code: captchaResponse,
      captcha_type: captchaType,
      email_address: this.registrationForm.value.emailAddress,
      first_name: this.registrationForm.value.firstName,
      last_name: this.registrationForm.value.lastName,
    }).subscribe({
        next: initialPerson => {
          // would like to move the line below inside `identityService.create` but that caused test errors when I tried
          this.identityService.saveJWT(initialPerson.id as string, initialPerson.completion_jwt as string);

          initialPerson.raw_password = this.registrationForm.value.password;

          this.identityService.update(initialPerson).subscribe({
            next: () => {
              this.readyToLogIn = true;
              this.captcha.reset(); // We'll need a new code to complete the auto-login.
              this.captcha.execute();
            },
            error: (error) => {
              this.captcha.reset();
              extractErrorMessage(error);
              this.processing = false;
            }
          });
        },
        error: (error) => {
          this.captcha.reset();
          extractErrorMessage(error);
          this.processing = false;
        }
      }
    );
  }
}
