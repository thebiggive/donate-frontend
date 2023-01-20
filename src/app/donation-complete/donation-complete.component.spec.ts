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
import {CampaignService} from "../campaign.service";
import {PageMetaService} from "../page-meta.service";

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

  it('Considers donations of £5k or more large', () => {
    const component = new DonationCompleteComponent(
      TestBed.inject(AnalyticsService),
      TestBed.inject(CampaignService),
      TestBed.inject(MatDialog),
      TestBed.inject(DonationService),
      TestBed.inject(IdentityService),
      TestBed.inject(PageMetaService),
      TestBed.inject(ActivatedRoute)
      );

    expect(1).toBeGreaterThanOrEqual(5);
  });

});
