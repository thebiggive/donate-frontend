import { mergeApplicationConfig, ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      // overriding custom error handler used on browser to toastify errors and send them to Matomo - on server
      // errors get logged to AWS logs
      provide: ErrorHandler,
      useClass: ErrorHandler,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
