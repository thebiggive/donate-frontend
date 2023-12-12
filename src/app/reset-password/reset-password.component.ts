import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getPasswordValidator } from '../validators/validate-passwords-same';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { minPasswordLength } from 'src/environments/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  minPasswordLength: number;
  passwordForm: FormGroup;
  savingNewPassword: boolean = false;
  saveSuccessful: boolean|undefined = undefined;
  errorMessageHtml: string | undefined;
  token: string;
  tokenValid: boolean|undefined = undefined;

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

    this.minPasswordLength = minPasswordLength;
  }

  get confirmPasswordField() {
    if (!this.passwordForm) {
      return undefined;
    }
    return this.passwordForm.controls.confirmPassword;
  }

  saveNewPassword = () => {
    this.savingNewPassword = true;
    this.identityService.resetPassword(this.passwordForm.controls.password!.value, this.token).subscribe({
      next: (_) => {
        this.savingNewPassword = false;
        this.errorMessageHtml = undefined;
        this.saveSuccessful = true;
      },
      error: (error) => {
        this.savingNewPassword = false;
        this.saveSuccessful = false;
        this.errorMessageHtml = error.error?.error?.description;
      },
    });
  };

  onPasswordConfirmationFocus = () => {
    this.passwordForm.get('confirmPassword')?.setValidators([
      Validators.required,
      Validators.minLength(10),
      getPasswordValidator(this.passwordForm.controls.password!.value),
    ])
  }
}
