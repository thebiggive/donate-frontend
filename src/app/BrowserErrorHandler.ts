import { ErrorHandler, inject } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';
import { environment } from '../environments/environment';
import { Toast } from './toast.service';

export class BrowserErrorHandler implements ErrorHandler {
  private matomoTracker = inject(MatomoTracker);
  private toast = inject(Toast);

  handleError(error: Error): void {
    console.error(error);
    // for now not including 'regression' in the list below, as the error message may be interferring with the bots
    // ability to click a button.
    if (['development', 'staging'].includes(environment.environmentId)) {
      // don't show toast in prod because it won't be useful to real users
      this.toast.showError(
        `${error.name}: ${error.message} (${environment.environmentId} error display, not shown in prod)`,
        { minDurationMs: 5_000, maxDurationMs: 15_000 },
      );
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
