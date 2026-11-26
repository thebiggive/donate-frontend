import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';
import { EMAIL_REGEXP } from '../validators/patterns';
import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';
import { WidgetInstance } from 'friendly-challenge';
import { BackendError, errorDescription } from '../backendError';
import { BiggiveTextInput } from '@biggive/components-angular';
import { PasswordInputComponent } from '../password-input/password-input.component';
import { RouterLink } from '@angular/router';
import { flags } from '../featureFlags';

@Component({
  selector: 'app-login-modal',
  templateUrl: 'login-modal.html',
  styleUrl: './login-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    PopupStandaloneComponent,
    BiggiveTextInput,
    PasswordInputComponent,
    RouterLink,
  ],
})
export class LoginModalComponent implements OnInit, AfterViewInit {
  private dialogRef = inject<MatDialogRef<LoginModalComponent>>(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private cdr = inject(ChangeDetectorRef);

  loginForm!: FormGroup;
  loggingIn = false;
  loginError?: string;
  forgotPassword = false;
  resetPasswordForm!: FormGroup;
  resetPasswordSuccess: boolean | undefined = undefined;
  userAskedForResetLink = false;
  protected readonly friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;
  protected readonly flags = flags;
  private captchaCode: string | undefined;
  @ViewChild('frccaptcha', { static: false })
  friendlyCaptcha!: ElementRef<HTMLElement>;
  private friendlyCaptchaWidget: WidgetInstance | undefined;

  ngOnInit() {
    if (environment.environmentId === 'regression' || flags.bypassFriendlyCaptcha) {
      this.captchaCode = 'dummy-captcha-code';
    }

    this.loginForm = this.formBuilder.group({
      emailAddress: [null, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
      password: [null, [Validators.required]],
    });

    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [null, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
    });
  }

  async ngAfterViewInit() {
    if (environment.environmentId === 'regression' || flags.bypassFriendlyCaptcha) {
      this.captchaCode = 'dummy-captcha-code';
      return;
    }

    if (!this.friendlyCaptcha) {
      return;
    }

    this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.captchaCode = solution;
        this.cdr.markForCheck();
      },
      errorCallback: () => {
        this.loginError = 'Sorry, there was an error with the anti-spam captcha check.';
        this.loggingIn = false;
        this.cdr.markForCheck();
      },
    });

    await this.friendlyCaptchaWidget.start();
  }
  async login(): Promise<void> {
    this.loggingIn = true;
    const credentials: Credentials = {
      captcha_code: this.captchaCode || (flags.bypassFriendlyCaptcha ? 'dummy-captcha-code' : ''),
      email_address: this.loginForm.value.emailAddress,
      raw_password: this.loginForm.value.password,
    };

    this.identityService.login(credentials).subscribe(
      (response: { id: string; jwt: string }) => {
        this.dialogRef.close(response);
        this.loggingIn = false;
      },
      async (error: BackendError) => {
        if (environment.environmentId === 'regression' || flags.bypassFriendlyCaptcha) {
          this.captchaCode = 'dummy-captcha-code';
        } else {
          this.friendlyCaptchaWidget?.reset();
          await this.friendlyCaptchaWidget?.start();
        }
        this.loginError = errorDescription(error);
        this.loggingIn = false;
        this.cdr.markForCheck();
      },
    );
  }

  resetPasswordClicked(): void {
    this.userAskedForResetLink = true;
    if (!this.captchaCode) {
      this.loginError = 'Sorry, there was an error with the anti-spam captcha check.';
      this.loggingIn = false;
      this.cdr.markForCheck();
      return;
    }

    this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, this.captchaCode).subscribe({
      next: (_) => {
        this.resetPasswordSuccess = true;
        this.cdr.markForCheck();
      },
      error: (_) => {
        this.resetPasswordSuccess = false;
        this.cdr.markForCheck();
      },
    });
  }

  forgotPasswordClicked(event: Event): void {
    event.preventDefault();
    this.forgotPassword = true;
  }
}
