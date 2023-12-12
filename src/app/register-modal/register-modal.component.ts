import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {RecaptchaComponent, RecaptchaModule} from 'ng-recaptcha';

import {allChildComponentImports} from '../../allChildComponentImports';
import {environment} from '../../environments/environment';
import {IdentityService} from '../identity.service';
import {EMAIL_REGEXP} from '../validators/patterns';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PopupStandaloneComponent} from "../popup-standalone/popup-standalone.component";

@Component({
  standalone: true,
  selector: 'app-register-modal',
  templateUrl: 'register-modal.html',
  styleUrls: ['./register-modal.component.scss'],
  imports: [
    ...allChildComponentImports,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    RecaptchaModule,
    PopupStandaloneComponent,
  ],
})
export class RegisterModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  form: FormGroup;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  registerError?: string;
  registerErrorHtml?: SafeHtml;
  registering = false;

  private readyToLogIn = false;

  constructor(
    private dialogRef: MatDialogRef<RegisterModalComponent>,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP),
      ]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
    });
  }

  captchaError() {
    this.registerError = 'Captcha error – please try again';
    this.registering = false;
  }

  captchaReturn(captchaResponse: string) {
    if (captchaResponse === null) {
      // We had a code but now don't, e.g. after expiry at 1 minute. In this case
      // the trigger wasn't a register click so do nothing. A repeat register attempt will
      // re-execute the captcha in `register()`.
      return;
    }

    if (this.readyToLogIn) {
      this.identityService.login({
        captcha_code: captchaResponse,
        email_address: this.form.value.emailAddress,
        raw_password: this.form.value.password,
      }).subscribe((response: { id: string, jwt: string }) => {
        this.dialogRef.close(response);
        this.registering = false;
      }, (error) => {
        this.captcha.reset();
        this.registerError = 'Auto login: ' + (error.error.description !== undefined ? error.error.description : error.message) || 'Unknown error';
        this.registering = false;
      });

      return;
    }

    const extractErrorMessage = (error: {error: {error: {description?: string, htmlDescription?: string}}, message?: string }) => {
      const errorInfo = error.error.error;
      if (errorInfo.htmlDescription) {
        // this HTML can only have come back from our identity server, which we consider trustworthy.
        this.registerErrorHtml = this.sanitizer.bypassSecurityTrustHtml(errorInfo.htmlDescription)
      } else {
        this.registerError = errorInfo.description || error.message || 'Unknown error';
      }
    }

    this.identityService.create({
      captcha_code: captchaResponse,
      email_address: this.form.value.emailAddress,
      first_name: this.form.value.firstName,
      last_name: this.form.value.lastName,
    }).subscribe(initialPerson => {
      initialPerson.raw_password = this.form.value.password;

      this.identityService.update(initialPerson).subscribe(() => {
        this.readyToLogIn = true;
        this.captcha.reset(); // We'll need a new code to complete the auto-login.
        this.captcha.execute();
      }, (error) => {
        this.captcha.reset();
        extractErrorMessage(error);
        this.registering = false;
      });
    }, (error) => {
      this.captcha.reset();
      extractErrorMessage(error);
      this.registering = false;
    });
  }

  register() {
    this.registering = true;
    this.captcha.reset();
    this.captcha.execute();
  }
}
