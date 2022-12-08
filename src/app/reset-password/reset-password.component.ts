import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { getPasswordValidator } from '../validators/validate-passwords-same';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';

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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('captcha') captcha: RecaptchaComponent;
  passwordForm: FormGroup;
  savingNewPassword: boolean = false;
  saveSuccessful: boolean|undefined = undefined;
  errorMessage: string;
  token: string;
  tokenValid: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

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
        this.identityService.checkTokenValid(this.token).subscribe(
          (response: {valid: boolean}) => {
            this.tokenValid = response.valid;
          },
          () => {
            this.tokenValid = false;
          }
        );
        if (!this.token) {
          this.router.navigate(['']);
        }
      }
    );
  }

  get confirmPasswordField() {
    if (!this.passwordForm) {
      return undefined;
    }
    return this.passwordForm.controls.confirmPassword;
  }

  saveNewPassword = () => {
    this.savingNewPassword = true;
    this.identityService.resetPassword(this.passwordForm.controls.password.value, this.token).subscribe(
      (response) => {
        this.savingNewPassword = false;
        this.saveSuccessful = true;
      },
      (error) => {
        this.savingNewPassword = false;
        this.saveSuccessful = false;
      }
    )
  };

  onPasswordConfirmationFocus = () => {
    this.passwordForm.get('confirmPassword')?.setValidators([
      Validators.required,
      Validators.minLength(10),
      getPasswordValidator(this.passwordForm.controls.password.value),
    ])
  }
}
