import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DonationCompleteComponent } from './donation-complete.component';

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
