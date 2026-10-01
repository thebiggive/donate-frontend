import { PLATFORM_ID } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment';
import { CloudflareService } from './cloudflare.service';
import { cloudflareInterceptor, donateSsrHeaderInterceptor } from './app.config';
import { SSR_CLOUDFLARE_TOKEN } from './ssr-token';

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
        { provide: SSR_CLOUDFLARE_TOKEN, useValue: 'test-ssr-token' },
        provideHttpClient(withInterceptors([cloudflareInterceptor, donateSsrHeaderInterceptor])),
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

    TestBed.inject(HttpClient)
      .get(apiUrl)
      .subscribe({ error: (error) => (receivedStatus = error.status) });

    httpTestingController.expectOne(apiUrl).flush('blocked', {
      status: 403,
      statusText: 'Forbidden',
    });

    jasmineExpect(receivedStatus).toBe(403);
    jasmineExpect(cloudflareService.isBlocked()).toBeFalse();
  });

  it('adds the SSR bypass token to requests back to Donate', () => {
    configure('server');
    const assetUrl = new URL('/assets/map/counties.geojson', environment.donateUriPrefix).toString();

    TestBed.inject(HttpClient).get(assetUrl).subscribe();

    const request = httpTestingController.expectOne(assetUrl);
    jasmineExpect(request.request.headers.get('X-TBG-Donate-SSR-Token')).toBe('test-ssr-token');
    request.flush({ type: 'FeatureCollection', features: [] });
  });

  it('does not expose the SSR bypass token to browser requests', () => {
    configure('browser');
    const assetUrl = new URL('/assets/map/counties.geojson', environment.donateUriPrefix).toString();

    TestBed.inject(HttpClient).get(assetUrl).subscribe();

    const request = httpTestingController.expectOne(assetUrl);
    jasmineExpect(request.request.headers.has('X-TBG-Donate-SSR-Token')).toBeFalse();
    request.flush({ type: 'FeatureCollection', features: [] });
  });

  it('retries a blocked browser request after Turnstile passes', () => {
    configure('browser');
    let receivedBody: unknown;

    TestBed.inject(HttpClient)
      .get(apiUrl)
      .subscribe((body) => {
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
