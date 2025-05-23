import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment';
import { Fund } from './fund.model';
import { FundService } from './fund.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('FundService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [FundService, provideHttpClient(withFetch()), provideHttpClientTesting()],
    }),
  );

  it('should retrieve Champion Funding details from API', () => {
    const service: FundService = TestBed.inject(FundService);
    const httpMock: HttpTestingController = TestBed.inject(HttpTestingController);

    const dummyFund: Fund = {
      id: 'asdfasdfasdfasdf12',
      type: 'championFund',
      name: 'Dummy unit test fund',
      totalForTicker: 10_000,
      amountRaised: 204.67,
      description: 'Dummy unit test descriptoin of the Champion',
      logoUri: 'https://example.com/an-image.png',
    };

    service.getOneBySlug('champion-fund-test-slug').subscribe(
      (fund) => {
        expect(fund).toEqual(dummyFund);
      },
      () => {
        expect(false).toBe(true); // Always fail if observable errors
      },
    );

    const request = httpMock.expectOne(
      `${environment.sfApiUriPrefix}/funds/services/apexrest/v1.0/funds/slug/champion-fund-test-slug`,
    );
    expect(request.request.method).toBe('GET');
    request.flush(dummyFund);
  });
});
