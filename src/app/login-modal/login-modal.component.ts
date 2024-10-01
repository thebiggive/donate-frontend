import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RecaptchaComponent, RecaptchaModule} from 'ng-recaptcha';

import {allChildComponentImports} from '../../allChildComponentImports';
import {Credentials} from '../credentials.model';
import {environment} from '../../environments/environment';
import {IdentityService} from '../identity.service';
import {EMAIL_REGEXP} from '../validators/patterns';
import {PopupStandaloneComponent} from "../popup-standalone/popup-standalone.component";
import {WidgetInstance} from "friendly-challenge";

@Component({
  standalone: true,
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
    RecaptchaModule,
    PopupStandaloneComponent,
  ],
})
export class LoginModalComponent implements OnInit, AfterViewInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  loginForm: FormGroup;
  loggingIn = false;
  loginError?: string;
  forgotPassword = false;
  resetPasswordForm: FormGroup;
  resetPasswordSuccess: boolean|undefined = undefined;
  userAskedForResetLink = false;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  protected readonly friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;
  private captchaCode: string | undefined;
  @ViewChild('frccaptcha', { static: false })
  friendlyCaptcha: ElementRef<HTMLElement>;

  constructor(
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
  ) {}

  ngOnInit() {
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


  }

  async ngAfterViewInit() {
    const widget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.captchaCode = solution;
      },
      errorCallback: () => {
        this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
        this.loggingIn = false;
      },
    })

    await widget.start()
  }
  login(): void {
    this.loggingIn = true;
    if (!this.captchaCode) {
      this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
      this.loggingIn = false;
      return;
    }

    const credentials: Credentials = {
      captcha_code: this.captchaCode,
      captcha_type: 'friendly_captcha',
      email_address: this.loginForm.value.emailAddress,
      raw_password: this.loginForm.value.password,
    };

    this.identityService.login(credentials).subscribe((response: { id: string, jwt: string }) => {
      this.dialogRef.close(response);
      this.loggingIn = false;
    }, (error) => {
      this.captcha.reset();
      const errorDescription = error.error.error.description;
      this.loginError = errorDescription || error.message || 'Unknown error';
      this.loggingIn = false;
    });
  }

  resetPasswordClicked(): void {
    this.userAskedForResetLink = true;
    if (!this.captchaCode) {
      this.loginError = "Sorry, there was an error with the anti-spam captcha check.";
      this.loggingIn = false;
      return;
    }

    this.identityService.getResetPasswordToken(this.resetPasswordForm.value.emailAddress, this.captchaCode).subscribe({
      next: _ => this.resetPasswordSuccess = true,
      error: _ => this.resetPasswordSuccess = false,
    });
  }

  forgotPasswordClicked(): void {
    this.forgotPassword = true;
  }
}
