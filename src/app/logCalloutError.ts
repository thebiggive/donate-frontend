import {MatomoTracker} from 'ngx-matomo-client';

export const logCalloutError = (
  isBrowser: boolean,
  context: string,
  calloutUrl?: string,
  matomoTracker?: MatomoTracker,
) => {
  if (!isBrowser) {
    console.error('Server-side error in: ' + context + '. Callout URL: ' + calloutUrl);
    return;
  }

  console.error('Client-side error in: ' + context + '. Callout URL: ' + calloutUrl);
  if (matomoTracker) {
    matomoTracker.trackEvent(
      'donate_error',
      'callout_error',
      context + ' – ' + calloutUrl,
    );
  }
};
