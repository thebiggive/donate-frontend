import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatomoModule } from 'ngx-matomo-client';
import { MatomoTestingModule } from 'ngx-matomo-client/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { ChangeRegularGivingComponent } from './change-regular-giving.component';

describe('ChangeRegularGivingComponent', () => {
  let component: ChangeRegularGivingComponent;
  let fixture: ComponentFixture<ChangeRegularGivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                paymentMethods: {
                  adHocMethods: [],
                  regularGivingPaymentMethod: {},
                },
              },
            },
          },
        },
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(withFetch()),
        { provide: MatomoModule, useClass: MatomoTestingModule },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeRegularGivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
