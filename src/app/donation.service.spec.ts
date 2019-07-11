import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { Donation } from './donation.model';
import { DonationService } from './donation.service';
import { environment } from '../environments/environment';
import { DonationCreatedResponse } from './donation-created-response.model';

describe('DonationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ DonationService ],
  }));

  it('should be created', () => {
    const service: DonationService = TestBed.get(DonationService);
    expect(service).toBeTruthy();
  });

  // Test service injection loosely based on https://alligator.io/angular/testing-httpclient/
  it(
    'should complete a create() with mocked service',
    inject(
      [HttpTestingController, DonationService],
      (
        httpMock: HttpTestingController,
        service: DonationService,
      ) => {
        const donation = new Donation(
          '01I400000009Sds3e2',
          1234.56,
          true,
          true,
          true,
          false,
          '01I400000009Sds3e2',
          '123 Main St, london, N1 1AA',
          'My Test Charity',
          'GB',
          new Date(),
          '01I400000009Sds3e2',
          'test@example.com',
          'Louis',
          'Theroux',
          0,
          500.01,
          'Pending',
          'd290f1ee-6c54-4b01-90e6-d701748f0851',
          new Date(),
        );

        service.create(donation).subscribe((result) => {
          expect(result.jwt).toEqual('mockJwtheader.mockJwtBody.mockJwtSignature');
          expect(result.donation.donationAmount).toEqual(1234.56);
          expect(result.donation.matchReservedAmount).toEqual(500.01);
          expect(result.donation.transactionId).toEqual('d290f1ee-6c54-4b01-90e6-d701748f0851');
        }, () => {
          expect(false).toBe(true); // Always fail if observable errors
        });

        const mockPost = httpMock.expectOne(`${environment.apiUriPrefix}/donations/services/apexrest/v1.0/donations`);

        expect(mockPost.cancelled).toBeFalsy();
        expect(mockPost.request.responseType).toEqual('json');

        const donationCreatedResponse = new DonationCreatedResponse(
          donation,
          'mockJwtheader.mockJwtBody.mockJwtSignature',
        );

        mockPost.flush(donationCreatedResponse);

        httpMock.verify();
      },
    ),
  );
});
