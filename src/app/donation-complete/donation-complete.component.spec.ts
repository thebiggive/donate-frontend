import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DonationCompleteComponent } from './donation-complete.component';

// Hack to ensure calls to the global from AnalyticsService as the component loads don't cause test
// errors. TODO - ideally, we should have a mock of the AnalyticsService for tests which doesn't touch
// the global and allows us to assert that specific GA calls are made.
const gtag = () => {};

describe('DonationCompleteComponent', () => {
  let component: DonationCompleteComponent;
  let fixture: ComponentFixture<DonationCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationCompleteComponent ],
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          {
            path: 'thanks/:donationId',
            component: DonationCompleteComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({donationId: 'myTestDonationId'}),
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {


    fixture = TestBed.createComponent(DonationCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
