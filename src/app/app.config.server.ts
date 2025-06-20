import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), provideAnimationsAsync('noop')],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
