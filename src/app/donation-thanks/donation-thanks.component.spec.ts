import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { MatomoModule } from 'ngx-matomo';
import {InMemoryStorageService} from 'ngx-webstorage-service';
import {of} from 'rxjs';

import {TBG_DONATE_STORAGE} from '../donation.service';
import {DonationThanksComponent} from './donation-thanks.component';
import {TBG_DONATE_ID_STORAGE} from '../identity.service';
import {Donation} from "../donation.model";

describe('DonationThanksComponent', () => {
  let component: DonationThanksComponent;
  let fixture: ComponentFixture<DonationThanksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatomoModule.forRoot({
          scriptUrl: `https://example.com/matomo.js`,
          trackers: [],
          routeTracking: {
            enable: true,
          }
        }),
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          {
            path: 'thanks/:donationId',
            component: DonationThanksComponent,
          },
        ]),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({donationId: 'myTestDonationId'})}},
        InMemoryStorageService,
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationThanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function donationOf(donationAmount: number, currencyCode: string): Donation {
    return {
      firstName: 'first name',
      lastName: 'last name',
      emailAddress: 'email address',
      charityId: "",
      currencyCode: currencyCode,
      donationAmount: donationAmount,
      donationMatched: false,
      feeCoverAmount: 0,
      matchReservedAmount: 0,
      matchedAmount: 0,
      pspMethodType: 'card',
      projectId: "",
      psp: "stripe",
      tipAmount: 0,
      status: "Paid"
    };
  }

  it('Considers donation of £5k to be large', () => {
    // Calling private setDonation method for test. Not a fan of doing this, but I couldn't work out how to get the
    // async stuff to happen to make this happen via a call to checkDonation in the test.
    // @ts-ignore private visibility error
    component.setDonation(donationOf(5_000, "GBP"));

    expect(component.donationIsLarge).toBeTrue();
  });

  it('Considers donation of under £5k to be not large', () => {
    // @ts-ignore private visibility error
    component.setDonation(donationOf(4999, "GBP"));

    expect(component.donationIsLarge).toBeFalse();
  });

  it('Considers donation of €5k to be not large', () => {
    // @ts-ignore private visibility error
    component.setDonation(donationOf(5000, "EUR"));

    expect(component.donationIsLarge).toBeFalse();
  });

  it('Considers donation of under €5k to be not large', () => {
    // @ts-ignore private visibility error
    component.setDonation(donationOf(4999, "EUR"));

    expect(component.donationIsLarge).toBeFalse();
  });

  it('Calculates backoff time in ms', () => {
    expect(component.calculateExponentialBackoffMs(0)).toEqual(2_000);
    expect(component.calculateExponentialBackoffMs(1)).toEqual(4_000);
    expect(component.calculateExponentialBackoffMs(2)).toEqual(8_000);
    expect(component.calculateExponentialBackoffMs(3)).toEqual(16_000);
  });
});
