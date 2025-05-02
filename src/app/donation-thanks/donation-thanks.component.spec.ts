import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { DonationThanksComponent } from './donation-thanks.component';
import { CompleteDonation } from '../donation.model';
import { MatomoModule } from 'ngx-matomo-client';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DonationThanksComponent', () => {
  let component: DonationThanksComponent;
  let fixture: ComponentFixture<DonationThanksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [],
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
        MatProgressSpinnerModule,
        RouterModule.forRoot([
          {
            path: 'thanks/:donationId',
            component: DonationThanksComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ donationId: 'myTestDonationId' }) },
        },
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationThanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function donationOf(donationAmount: number, currencyCode: string): CompleteDonation {
    return {
      collectedTime: 'collected-time-not-used-here',
      totalPaid: donationAmount,
      firstName: 'first name',
      lastName: 'last name',
      emailAddress: 'email address',
      charityId: '',
      currencyCode: currencyCode,
      donationAmount: donationAmount,
      donationMatched: false,
      matchReservedAmount: 0,
      matchedAmount: 0,
      pspMethodType: 'card',
      projectId: '',
      psp: 'stripe',
      tipAmount: 0,
      status: 'Paid',
    };
  }

  it('Considers donation of £5k to be large', () => {
    // Calling private setDonation method for test. Not a fan of doing this, but I couldn't work out how to get the
    // async stuff to happen to make this happen via a call to checkDonation in the test.
    // @ts-expect-error private visibility error
    component.setDonation(donationOf(5_000, 'GBP'));

    expect(component.donationIsLarge).toBeTrue();
  });

  it('Considers donation of under £5k to be not large', () => {
    // @ts-expect-error private visibility error
    component.setDonation(donationOf(4999, 'GBP'));

    expect(component.donationIsLarge).toBeFalse();
  });

  it('Considers donation of €5k to be not large', () => {
    // @ts-expect-error private visibility error
    component.setDonation(donationOf(5000, 'EUR'));

    expect(component.donationIsLarge).toBeFalse();
  });

  it('Considers donation of under €5k to be not large', () => {
    // @ts-expect-error private visibility error
    component.setDonation(donationOf(4999, 'EUR'));

    expect(component.donationIsLarge).toBeFalse();
  });

  it('Calculates backoff time in ms', () => {
    expect(component.calculateExponentialBackoffMs(0)).toEqual(2_000);
    expect(component.calculateExponentialBackoffMs(1)).toEqual(4_000);
    expect(component.calculateExponentialBackoffMs(2)).toEqual(8_000);
    expect(component.calculateExponentialBackoffMs(3)).toEqual(16_000);
  });
});
