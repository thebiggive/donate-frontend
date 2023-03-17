import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { getPasswordValidator } from '../validators/validate-passwords-same';
import { allChildComponentImports } from '../../allChildComponentImports';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { minPasswordLength } from 'src/environments/common';

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
  ],
})
export class ResetPasswordComponent implements OnInit {
  minPasswordLength: number;
  passwordForm: FormGroup;
  savingNewPassword: boolean = false;
  saveSuccessful: boolean|undefined = undefined;
  errorMessage: string | undefined;
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
    this.identityService.resetPassword(this.passwordForm.controls.password!.value, this.token).subscribe(
      (response) => {
        this.savingNewPassword = false;
        this.saveSuccessful = true;
      },
      (error) => {
        this.savingNewPassword = false;
        this.saveSuccessful = false;
        this.errorMessage = error.error?.error?.description;
      }
    )
  };

  onPasswordConfirmationFocus = () => {
    this.passwordForm.get('confirmPassword')?.setValidators([
      Validators.required,
      Validators.minLength(10),
      getPasswordValidator(this.passwordForm.controls.password!.value),
    ])
  }
}
