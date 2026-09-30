import { isPlatformServer } from '@angular/common';
import {
  mergeApplicationConfig,
  ApplicationConfig,
  ErrorHandler,
  inject,
  PLATFORM_ID,
  CSP_NONCE,
  RESPONSE_INIT,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: CSP_NONCE, // Required for event replay.
      useFactory: () => {
        // See `handle()` call in `server.ts` and prior middleware which generates a per-request nonce.
        const responseInit = inject(RESPONSE_INIT, { optional: true });
        // server.ts counterpart is typed as unknown.
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        return responseInit?.headers ? (responseInit as any).nonce : null;
      },
    },
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
