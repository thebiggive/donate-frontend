import { APP_BASE_HREF, AsyncPipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatomoModule } from 'ngx-matomo-client';
import { MatomoTestingModule } from 'ngx-matomo-client/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { AppComponent } from './app.component';
import { TBG_DONATE_STORAGE } from './donation.service';
import { CloudflareService } from './cloudflare.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        AsyncPipe,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        AppComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: 'http://some.test.localhost' },
        { provide: MatomoModule, useClass: MatomoTestingModule },
        InMemoryStorageService,
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('makes the Turnstile widget visible when Cloudflare blocks a request', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const cfService = TestBed.inject(CloudflareService);

    expect(app.isWidgetVisible()).toBe(true);

    cfService.notifyBlocked();
    expect(app.isWidgetVisible()).toBe(true);
  });
});
