import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Donation } from './donation.model';
import { DonationCreatedResponse } from './donation-created-response.model';
import { DonationService } from './donation.service';
import { environment } from '../environments/environment';

describe('DonationService', () => {
  const getDummyDonation = () => {
    return new Donation(
      '01I400000009Sds3e2',
      1234.56,
      true,
      true,
      true,
      false,
      '11I400000009Sds3e3',
      '123 Main St, london, N1 1AA',
      'My Test Charity',
      'GB',
      new Date(),
      '21I400000009Sds3e4',
      'test@example.com',
      'Louis',
      'Theroux',
      0,
      500.01,
      'Pending',
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
      new Date(),
    );
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule, RouterTestingModule ],
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
      [HttpTestingController],
      (
        httpMock: HttpTestingController,
      ) => {
        const service: DonationService = TestBed.get(DonationService);
        const donation = getDummyDonation();

        service.create(donation).subscribe(result => {
          expect(result.jwt).toEqual('mockJwtheader.mockJwtBody.mockJwtSignature');
          expect(result.donation.donationAmount).toEqual(1234.56);
          expect(result.donation.matchReservedAmount).toEqual(500.01);
          expect(result.donation.transactionId).toEqual('d290f1ee-6c54-4b01-90e6-d701748f0851');
        }, () => {
          expect(false).toBe(true); // Always fail if observable errors
        });

        const mockPost = httpMock.expectOne(`${environment.apiUriPrefix}/donations/services/apexrest/v1.0/donations`);

        expect(mockPost.request.method).toEqual('POST');
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

  it('should save local donation data and find the donation by ID', () => {
    const service: DonationService = TestBed.get(DonationService);
    const inputDonation = getDummyDonation();
    service.saveDonation(inputDonation, 'fakeheader.fakebody.fakesig');

    expect(service.getDonation(inputDonation.donationId)).toBe(inputDonation);
  });

  it('should correctly determine when a donation is complete', () => {
    const service: DonationService = TestBed.get(DonationService);
    const donation: Donation = getDummyDonation();
    donation.status = 'Paid';

    expect(service.isComplete(donation)).toBe(true);
  });

  it('should correctly determine when a donation is incomplete', () => {
    const service: DonationService = TestBed.get(DonationService);
    const donation: Donation = getDummyDonation();
    donation.status = 'Refunded';

    expect(service.isComplete(donation)).toBe(false);
  });

  it('should find a resumable donation by project ID',
    inject([HttpTestingController], (
      httpMock: HttpTestingController,
    ) => {
      const service: DonationService = TestBed.get(DonationService);
      const inputDonation = getDummyDonation();

      service.saveDonation(inputDonation, 'fakeheader.fakebody.fakesig');

      service.getResumableDonation('11I400000009Sds3e3').subscribe(outputDonation => {
        expect(outputDonation).toBe(inputDonation);
      }, () => {
        expect(false).toBe(true); // Always fail on observable error
      });

      // After it finds a local match, getResumableDonation() will hit the server for the latest copy via
      // `DonationService.get()`.
      const mockGet = httpMock.expectOne(
        `${environment.apiUriPrefix}/donations/services/apexrest/v1.0/donations/${inputDonation.donationId}`,
      );
      expect(mockGet.request.method).toBe('GET');
      expect(mockGet.cancelled).toBeFalsy();
      expect(mockGet.request.responseType).toEqual('json');
      mockGet.flush(inputDonation);
      httpMock.verify();
    }),
  );

  it('should return undefined for resumable donations with unknown project ID', () => {
    const service: DonationService = TestBed.get(DonationService);
    service.saveDonation(getDummyDonation(), 'fakeheader.fakebody.fakesig');
    service.getResumableDonation('notARealProjectId').subscribe(donation => {
      expect(donation).toBeUndefined();
    }, () => {
      expect(false).toBe(true); // Always fail on observable error
    });
  });
});
