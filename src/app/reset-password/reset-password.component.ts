import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { getPasswordValidator } from '../validators/validate-passwords-same';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
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
export class ResetPasswordComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;
  passwordForm: FormGroup;
  savingNewPassword: false;
  token: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: [null, [
        Validators.required,
        Validators.minLength(10),
      ]],
      confirmPassword: [null, [
        Validators.required,
      ]],
    });

    this.route.queryParams
      .subscribe(params => {
        this.token = params.token;
        if (!this.token) {
          this.router.navigate(['']);
        }
      }
    );
  }

  get passwordField() {
    if (!this.passwordForm) {
      return undefined;
    }

    return this.passwordForm.get('passwordField');
  }

  get confirmPasswordField() {
    if (!this.passwordForm) {
      return undefined;
    }
    return this.passwordForm.controls.confirmPassword;
  }

  saveNewPassword = () => {
  };

  onPasswordConfirmationFocus = () => {
    this.passwordForm.get('confirmPassword')?.setValidators([
      Validators.required,
      Validators.minLength(10),
      getPasswordValidator(this.passwordForm.controls.password.value),
    ])
  }
}
