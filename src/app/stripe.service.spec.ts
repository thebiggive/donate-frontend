import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatomoModule } from 'ngx-matomo';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { TBG_DONATE_STORAGE } from './donation.service';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatomoModule.forRoot({
          scriptUrl: `https://example.com/matomo.js`,
          trackers: [],
          routeTracking: {
            enable: true,
          }
        }),
        RouterTestingModule,
      ],
      providers: [
        InMemoryStorageService,
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    });
    service = TestBed.inject(StripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
