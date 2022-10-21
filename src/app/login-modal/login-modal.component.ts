import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RecaptchaComponent } from 'ng-recaptcha';

import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: 'login-modal.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModal implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  form: FormGroup;
  loginError?: string;
  loggingIn = false;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;

  constructor(
    private dialogRef: MatDialogRef<LoginModal>,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
    });
  }

  captchaReturn(captchaResponse: string) {
    if (captchaResponse === null) {
      // We had a code but now don't, e.g. after expiry at 1 minute. In this case
      // the trigger wasn't a login click so do nothing. A repeat login attempt will
      // re-execute the captcha in `login()`.
      return;
    }

    this.loggingIn = true;

    const credentials: Credentials = {
      captcha_code: captchaResponse,
      email_address: this.form.value.emailAddress,
      raw_password: this.form.value.password,
    };

    this.identityService.login(credentials).subscribe((response: { id: string, jwt: string }) => {
      this.identityService.saveJWT(response.id, response.jwt);
      this.dialogRef.close(response);
      this.loggingIn = false;
    }, (error) => {
      this.captcha.reset();
      this.loginError = error.error.error.description || 'Unknown error';
      this.loggingIn = false;
    });
  }

  login() {
    this.captcha.reset();
    this.captcha.execute();
  }
}
