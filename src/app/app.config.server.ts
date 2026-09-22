import { APP_BASE_HREF } from '@angular/common';
import { mergeApplicationConfig, ApplicationConfig, ErrorHandler, inject } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';

import { appConfig } from './app.config';
import { COUNTRY_CODE } from './country-code.token';
import { environment } from '../environments/environment';
import { REQUEST } from '../express.tokens';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

const token = process.env['DONATE_CLOUDFLARE_SSR_TOKEN'];

if (environment.productionLike && !token) {
  throw new Error('DONATE_CLOUDFLARE_SSR_TOKEN is not configured');
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Ensure we render with a supported base HREF, including behind an ALB and regardless of the
    // base reported by CDNs when talking to the origin.
    { provide: APP_BASE_HREF, useValue: environment.donateUriPrefix },
    {
      provide: COUNTRY_CODE,
      useFactory: () => {
        const req = inject(REQUEST);
        // Prefer Cloudflare, then CloudFront header values.
        return req.header('CF-IPCountry') || req.header('CloudFront-Viewer-Country') || undefined;
      },
    },
    {
      provide: SSR_CLOUDFLARE_TOKEN,
      useValue: token,
    },
    {
      // overriding custom error handler used on browser to toastify errors and send them to Matomo - on server
      // errors get logged to AWS logs
      provide: ErrorHandler,
      useClass: ErrorHandler,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
