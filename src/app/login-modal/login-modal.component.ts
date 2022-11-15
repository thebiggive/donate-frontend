import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import { Credentials } from '../credentials.model';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';

@Component({
  standalone: true,
  selector: 'app-login-modal',
  templateUrl: 'login-modal.html',
  styleUrls: ['./login-modal.component.scss'],
  imports: [
    ...allChildComponentImports,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
})
export class LoginModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  form: FormGroup;
  loginError?: string;
  loggingIn = false;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;

  constructor(
    private dialogRef: MatDialogRef<LoginModalComponent>,
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
      this.loginError = (error.error.description !== undefined ? error.error.description : error.message) || 'Unknown error';
      this.loggingIn = false;
    });
  }

  login() {
    this.captcha.reset();
    this.captcha.execute();
  }
}
