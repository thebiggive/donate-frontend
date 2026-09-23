import { isPlatformServer } from '@angular/common';
import { mergeApplicationConfig, ApplicationConfig, ErrorHandler, inject, PLATFORM_ID } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
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
