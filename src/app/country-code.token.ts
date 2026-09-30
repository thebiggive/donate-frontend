import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID, REQUEST } from '@angular/core';

// Default country code helper, based on request headers
export const COUNTRY_CODE = new InjectionToken<string | undefined>('COUNTRY_CODE', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
      return undefined;
    }

    const req = inject(REQUEST, { optional: true }) as Request;
    // e.g. client side
    if (!req) {
      return undefined;
    }

    // Prefer Cloudflare, then CloudFront header values.
    if (req.headers && typeof req.headers.get === 'function') {
      return req.headers.get('CF-IPCountry') || req.headers.get('CloudFront-Viewer-Country') || undefined;
    }

    return undefined;
  },
});
