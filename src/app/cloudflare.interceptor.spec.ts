import { PLATFORM_ID } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment';
import { CloudflareService } from './cloudflare.service';
import { cloudflareInterceptor } from './app.config';

const jasmineExpect = expect as unknown as (actual: unknown) => {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeTrue(): void;
  toBeFalse(): void;
};

describe('cloudflareInterceptor', () => {
  const apiUrl = `${environment.matchbotApiOrigin}/v1/campaigns`;
  let httpTestingController: HttpTestingController;
  let cloudflareService: CloudflareService;

  function configure(platformId: string) {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        provideHttpClient(withInterceptors([cloudflareInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    cloudflareService = TestBed.inject(CloudflareService);
  }

  afterEach(() => {
    httpTestingController.verify();
  });

  it('does not wait for a Turnstile event during SSR', () => {
    configure('server');
    let receivedStatus: number | undefined;

    TestBed.inject(HttpClient).get(apiUrl).subscribe({ error: (error) => (receivedStatus = error.status) });

    httpTestingController.expectOne(apiUrl).flush('blocked', {
      status: 403,
      statusText: 'Forbidden',
    });

    jasmineExpect(receivedStatus).toBe(403);
    jasmineExpect(cloudflareService.isBlocked()).toBeFalse();
  });

  it('retries a blocked browser request after Turnstile passes', () => {
    configure('browser');
    let receivedBody: unknown;

    TestBed.inject(HttpClient).get(apiUrl).subscribe((body) => {
      receivedBody = body;
    });

    httpTestingController.expectOne(apiUrl).flush('blocked', {
      status: 403,
      statusText: 'Forbidden',
    });
    jasmineExpect(cloudflareService.isBlocked()).toBeTrue();

    cloudflareService.notifyPassed();
    const retry = httpTestingController.expectOne(apiUrl);
    jasmineExpect(retry.request.withCredentials).toBeTrue();
    retry.flush({ campaigns: [] });

    jasmineExpect(receivedBody).toEqual({ campaigns: [] });
  });
});