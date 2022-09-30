import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RecaptchaComponent } from 'ng-recaptcha';

import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-donation-start-login-dialog',
  templateUrl: 'donation-start-login-dialog.html',
  styleUrls: ['./donation-start-login-dialog.component.scss'],
})
export class DonationStartLoginDialogComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;

  form: FormGroup;
  loginError?: string;

  constructor(
    private dialogRef: MatDialogRef<DonationStartLoginDialogComponent>,
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
    const credentials: Credentials = {
      captcha_code: captchaResponse,
      email_address: this.form.value.emailAddress,
      raw_password: this.form.value.password,
    };

    this.identityService.login(credentials).subscribe((response: { id: string, jwt: string }) => {
      this.identityService.saveJWT(response.id, response.jwt);
      this.dialogRef.close(response);
    }, (error) => {
      this.loginError = error.error.error.description || 'Unknown error';
    });
  }

  login() {
    this.captcha.execute();
  }
}
