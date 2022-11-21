import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    AppModule,
    NoopAnimationsModule,
    ServerModule,
    FlexLayoutServerModule, // Must come after AppModule, see https://github.com/angular/flex-layout/blob/master/guides/SSR.md
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
