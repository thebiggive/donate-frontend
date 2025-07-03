import { ErrorHandler, inject } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';
import { environment } from '../environments/environment';
import { Toast } from './toast.service';

export class BrowserErrorHandler implements ErrorHandler {
  private matomoTracker = inject(MatomoTracker);
  private toast = inject(Toast);

  handleError(error: Error): void {
    console.error(error);
    if (['development', 'regression'].includes(environment.environmentId)) {
      // don't show toast in prod because it won't be useful to real users, don't show in staging until we've
      // reviewed how it looks and if there are too many errors in dev env
      this.toast.showError(error.name + ': ' + error.message, { minDurationMs: 5_000, maxDurationMs: 15_000 });
    }

    if (environment.environmentId !== 'development') {
      // don't send to matomo from dev because we have no idea what the state of the code was on a dev env at any time so logs will not be useful.
      this.matomoTracker.trackEvent(
        'donate_error',
        'app',
        error.name + ': ' + error.message + ', ' + +(error?.stack?.substring(0, 200) || 'no stack trace'),
      );
    }
  }
}
