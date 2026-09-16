import { mergeApplicationConfig, ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';

import { appConfig } from './app.config';
import { environment } from '../environments/environment';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

const token = process.env['DONATE_CLOUDFLARE_SSR_TOKEN'];

if (environment.productionLike && !token) {
  throw new Error('DONATE_CLOUDFLARE_SSR_TOKEN is not configured');
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
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
