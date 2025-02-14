import {
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  NgModule,
  PLATFORM_ID,
  provideExperimentalZonelessChangeDetection,
  provideZoneChangeDetection
} from '@angular/core';
import {PlatformModule} from '@angular/cdk/platform';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {provideServerRendering, ServerModule} from '@angular/platform-server';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    AppModule,
    NoopAnimationsModule,
    // PlatformModule,
    ServerModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideServerRendering(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideExperimentalZonelessChangeDetection(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
