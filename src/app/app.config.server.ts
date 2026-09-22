import { APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { mergeApplicationConfig, ApplicationConfig, ErrorHandler, inject, PLATFORM_ID } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';

import { appConfig } from './app.config';
import { environment } from '../environments/environment';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Ensure we render with a supported base HREF, including behind an ALB and regardless of the
    // base reported by CDNs when talking to the origin.
    { provide: APP_BASE_HREF, useValue: environment.donateUriPrefix },
    {
      provide: SSR_CLOUDFLARE_TOKEN,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        if (isPlatformServer(platformId) && typeof process !== 'undefined') {
          return process.env['DONATE_CLOUDFLARE_SSR_TOKEN'] ?? undefined;
        }
        return undefined;
      },
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
