import {MatomoTracker} from 'ngx-matomo-client';

export const logCalloutError = (
  isBrowser: boolean,
  context: string,
  calloutIdentifier?: string,
  matomoTracker?: MatomoTracker,
) => {
  if (!isBrowser) {
    console.error('Server-side error in: ' + context + '. Callout identifier: ' + calloutIdentifier);
    return;
  }

  console.error('Client-side error in: ' + context + '. Callout identifier: ' + calloutIdentifier);
  if (matomoTracker) {
    matomoTracker.trackEvent(
      'campaign_error',
      'callout_error',
      context + ' – ' + calloutIdentifier,
    );
  }
};
