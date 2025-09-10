import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput } from '@biggive/components-angular';
import { addBodyClass, removeBodyClass } from '../bodyStyle';
import { Toast } from '../toast.service';
import { environment } from '../../environments/environment';
import { WidgetInstance } from 'friendly-challenge';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Mailing list signup component
 */
@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrl: './mailing-list.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BiggiveButton, BiggiveHeading, BiggivePageSection, BiggiveTextInput],
})
export class MailingListComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Used to prevent displaying the page before all parts are ready **/
  public pageInitialised = false;
  private formBuilder = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  mailingList = input.required<'donor' | 'charity'>();
  friendlyCaptchaSiteKey = environment.friendlyCaptchaSiteKey;
  private friendlyCaptchaSolution: string | undefined;
  private friendlyCaptchaWidget!: WidgetInstance;
  private http = inject(HttpClient);

  @ViewChild('frccaptcha', { static: false })
  protected friendlyCaptcha!: ElementRef<HTMLElement>;

  mailingListForm;
  submitted = false;
  showThankYouMessage = false;
  private toast = inject(Toast);

  constructor() {
    this.mailingListForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(35)]],
      lastName: ['', [Validators.required, Validators.maxLength(35)]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      jobTitle: ['', [Validators.maxLength(35)]],
      organisationName: ['', [Validators.maxLength(35)]],
    });
  }

  ngOnInit(): void {
    addBodyClass(this.platformId, 'primary-colour');
    this.pageInitialised = true;

    if (this.mailingList() === 'charity') {
      this.mailingListForm.controls.jobTitle.setValidators([Validators.required, Validators.maxLength(35)]);
    }
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (environment.environmentId === 'regression') {
      this.friendlyCaptchaSolution = 'dummy-captcha-code';
      return;
    }

    this.friendlyCaptchaWidget = new WidgetInstance(this.friendlyCaptcha.nativeElement, {
      doneCallback: (solution) => {
        this.friendlyCaptchaSolution = solution;
      },
      errorCallback: () => {},
    });
    await this.friendlyCaptchaWidget.start();
  }

  ngOnDestroy() {
    removeBodyClass(this.platformId, 'primary-colour');
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.mailingListForm.invalid) {
      this.toast.showError('Please fill in all required fields and try again');
      return;
    }

    if (!this.friendlyCaptchaSolution) {
      this.toast.showError('Please complete the Captcha check');
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(
          environment.matchbotApiPrefix + '/mailing-list-signup',
          {
            mailinglist: this.mailingList(),
            firstName: this.mailingListForm.controls.firstName.value,
            lastName: this.mailingListForm.controls.lastName.value,
            emailAddress: this.mailingListForm.controls.emailAddress.value,
            jobTitle: this.mailingListForm.controls.jobTitle.value,
            organisationName: this.mailingListForm.controls.organisationName.value,
          },
          {
            headers: {
              'x-captcha-code': this.friendlyCaptchaSolution,
            },
          },
        ),
      );
    } catch (_error) {
      this.toast.showError('Sorry, there was an error trying to add your details to the mailing list.');
      return;
    }

    this.showThankYouMessage = true;
  }
}
