import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';
import { EMAIL_REGEXP } from '../validators/patterns';
import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';
import { WidgetInstance } from 'friendly-challenge';
import { BackendError, errorDescription } from '../backendError';

@Component({
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
    PopupStandaloneComponent,
  ],
})
export class LoginModalComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  loggingIn = false;
  loginError?: string;
  forgotPassword = false;
  resetPasswordForm!: FormGroup;
  resetPasswordSuccess: boolean | undefined = undefined;
  userAskedForResetLink = false;
  protected readonly friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;
  private captchaCode: string | undefined;
  @ViewChild('frccaptcha', { static: false })
  friendlyCaptcha!: ElementRef<HTMLElement>;
  private friendlyCaptchaWidget: WidgetInstance | undefined;

  constructor(
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailAddress: [null, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
      password: [null, [Validators.required]],
    });

    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [null, [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
    });
  }

  async ngAfterViewInit() {
    this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.captchaCode = solution;
      },
      errorCallback: () => {
        this.loginError = 'Sorry, there was an error with the anti-spam captcha check.';
        this.loggingIn = false;
      },
    });

    await this.friendlyCaptchaWidget.start();
  }
  login(): void {
    this.loggingIn = true;
    const credentials: Credentials = {
      captcha_code: this.captchaCode || '',
      email_address: this.loginForm.value.emailAddress,
      raw_password: this.loginForm.value.password,
    };

    this.identityService.login(credentials).subscribe(
      (response: { id: string; jwt: string }) => {
        this.dialogRef.close(response);
        this.loggingIn = false;
      },
      async (error: BackendError) => {
        this.friendlyCaptchaWidget?.reset();
        await this.friendlyCaptchaWidget?.start();
        this.loginError = errorDescription(error);
        this.loggingIn = false;
      },
    );
  }

  resetPasswordClicked(): void {
    this.userAskedForResetLink = true;
    if (!this.captchaCode) {
      this.loginError = 'Sorry, there was an error with the anti-spam captcha check.';
      this.loggingIn = false;
      return;
    }

    this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, this.captchaCode).subscribe({
      next: (_) => (this.resetPasswordSuccess = true),
      error: (_) => (this.resetPasswordSuccess = false),
    });
  }

  forgotPasswordClicked(): void {
    this.forgotPassword = true;
  }
}
