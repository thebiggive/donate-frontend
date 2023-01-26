import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import {DonationService, TBG_DONATE_STORAGE} from '../donation.service';
import { DonationCompleteComponent } from './donation-complete.component';
import {IdentityService, TBG_DONATE_ID_STORAGE} from '../identity.service';
import {Donation} from "../donation.model";
import {CampaignService} from "../campaign.service";
import {PageMetaService} from "../page-meta.service";

function createComponentWithHandMadeFakes() {
  const donationService = {
    // get: () => ({subscribe: () => Promise.resolve(largeDonation)}),
    // getDonation: () => (largeDonation),
    // removeOldLocalDonations: () => null,
    updateLocalDonation: () => null,
  }

  const route = {
    params: {
      pipe: () => ({subscribe: () => Promise.resolve({donationId: 42})})
    }
  };

  const identityService = {
    getIdAndJWT: () => false
  };

  const campaignService = {
    getOneById: () => ({subscribe: () => null})
  };

  const analyticsService = {
    logEvent: () => null,
  };

  const component = new DonationCompleteComponent(
    analyticsService as unknown as AnalyticsService,
    campaignService as unknown as CampaignService,
    null as unknown as MatDialog,
    donationService as unknown as DonationService,
    identityService as unknown as IdentityService,
    null as unknown as PageMetaService,
    route as unknown as ActivatedRoute
  );
  return component;
}

describe('DonationCompleteComponent', () => {
  let analyticsService: AnalyticsService;
  let component: DonationCompleteComponent;
  let fixture: ComponentFixture<DonationCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          {
            path: 'thanks/:donationId',
            component: DonationCompleteComponent,
          },
        ]),
      ],
      providers: [
        AnalyticsService,
        { provide: ActivatedRoute, useValue: { params: of({donationId: 'myTestDonationId'})}},
        InMemoryStorageService,
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    });

    // We must mock AnalyticsService so we don't touch the window/global var which is unavailable.
    // This also lets the test assert that a specific GA method call is made.
    analyticsService = TestBed.inject(AnalyticsService);
    spyOn(analyticsService, 'logError');

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // We bootstrap with a fake, unknown donation ID. So the thanks page should error out on load
    // and log that error to GA.
    expect(analyticsService.logError).toHaveBeenCalled();
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
      paymentMethodType: 'card',
      projectId: "",
      psp: "stripe",
      tipAmount: 0
    };
  }

  it('Considers donation of £5k to be large', () => {
    const largeDonation = donationOf(5_000, "GBP");
  //  const component = createComponentWithHandMadeFakes();

    // Calling private setDonation method for test. Not a fan of doing this, but I couldn't work out how to get the
    // async stuff to happen to make this happen via a call to checkDonation in the test.
    // @ts-ignore
    component.setDonation(largeDonation);

    expect(component.donationIsLarge).toBeTrue();
  });
});
