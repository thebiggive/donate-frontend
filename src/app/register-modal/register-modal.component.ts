import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

import { allChildComponentImports } from '../../allChildComponentImports';
import { environment } from '../../environments/environment';
import { IdentityService } from '../identity.service';


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
  ],
})
export class RegisterModalComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;

  form: FormGroup;
  recaptchaIdSiteKey = environment.recaptchaIdentitySiteKey;
  registerError?: string;
  registering = false;

  private readyToLogIn = false;

  constructor(
    private dialogRef: MatDialogRef<RegisterModalComponent>,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      emailAddress: [null, [
        Validators.required,
        Validators.email,
      ]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
    });    
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
        this.identityService.saveJWT(response.id, response.jwt);
        this.dialogRef.close(response);
        this.registering = false;
      }, (error) => {
        this.captcha.reset();
        this.registerError = 'Auto login: ' + error.error.description || error.message || 'Unknown error';
        this.registering = false;
      });

      return;
    }

    this.registering = true;

    this.identityService.create({
      email_address: this.form.value.emailAddress,
      first_name: this.form.value.firstName,
      last_name: this.form.value.lastName,
    }).subscribe(initialPerson => {
      this.identityService.saveJWT(initialPerson.id as string, initialPerson.completion_jwt as string);

      initialPerson.raw_password = this.form.value.password;

      this.identityService.update(initialPerson).subscribe(() => {
        this.readyToLogIn = true;
        this.captcha.reset(); // We'll need a new code to complete the auto-login.
        this.captcha.execute();
      }, (error) => {
        this.captcha.reset();
        this.registerError = 'Update: ' + error.error.description || error.message || 'Unknown error';
        this.registering = false;
      });
    }, (error) => {
      this.captcha.reset();
      this.registerError = 'Create: ' + error.error.description || error.message || 'Unknown error';
      this.registering = false;
    });
  }

  register() {
    this.captcha.reset();
    this.captcha.execute();
  }
}
