import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import { TBG_DONATE_STORAGE } from '../donation.service';
import { DonationCompleteComponent } from './donation-complete.component';
import { TBG_DONATE_ID_STORAGE } from '../identity.service';

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
});
