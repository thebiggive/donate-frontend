import { inject, InjectionToken, REQUEST } from '@angular/core';
import { Request } from 'express';

// Default country code helper, based on request headers
export const COUNTRY_CODE = new InjectionToken<string | undefined>('COUNTRY_CODE', {
  providedIn: 'root',
  factory: () => {
    const req = inject(REQUEST, { optional: true }) as Request | null;
    // e.g. client side
    if (!req) {
      return undefined;
    }

    // Prefer Cloudflare, then CloudFront header values.
    return req.header('CF-IPCountry') || req.header('CloudFront-Viewer-Country') || undefined;
  },
});
