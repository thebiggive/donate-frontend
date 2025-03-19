import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeRegularGivingComponent} from './change-regular-giving.component';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {MatomoModule} from 'ngx-matomo-client';
import {ActivatedRoute} from '@angular/router';
import {InMemoryStorageService} from 'ngx-webstorage-service';
import {TBG_DONATE_STORAGE} from '../donation.service';

describe('ChangeRegularGivingComponent', () => {
  let component: ChangeRegularGivingComponent;
  let fixture: ComponentFixture<ChangeRegularGivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatomoModule.forRoot({
          siteId: "",
          trackerUrl: "",
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {data: {
                paymentMethods: {
                  adHocMethods: [],
                  regularGivingPaymentMethod: {

                  },
                },
              }},
          }
        },
        InMemoryStorageService,
        {provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService},
        provideHttpClient(withFetch()),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChangeRegularGivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
