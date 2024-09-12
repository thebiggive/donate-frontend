import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from "@angular/common/http";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
import {InMemoryStorageService} from "ngx-webstorage-service";
import {of} from "rxjs";
import {PaymentMethod} from "@stripe/stripe-js";

import {DonationService, TBG_DONATE_STORAGE} from "../donation.service";
import {IdentityService, TBG_DONATE_ID_STORAGE} from '../identity.service';
import {MyAccountComponent} from "./my-account.component";
import { ActivatedRoute } from '@angular/router';
import {NgxMatomoModule} from "ngx-matomo-client";

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyAccountComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientModule,
        MatDialogModule,
        NgxMatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} }, // Needed for ngx-matomo not to crash.
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const mockIdentityService = TestBed.inject(IdentityService);
    spyOn(mockIdentityService, 'getLoggedInPerson').and.returnValue(of({
      first_name: 'Generous',
      last_name: "Donor",
      email_address: "donor@example.com"
    }));

    const paymentMethods: PaymentMethod[] = [
      {
        created: 0,
        customer: null,
        livemode: false,
        metadata: {},
        type: 'card',
        object: 'payment_method',
        id: 'method_id',
        billing_details: {
          address: null,
          phone: null,
          email: null,
          name: null,
        },
        card: {
          networks: null,
          checks: null,
          country: null,
          exp_month: 5,
          exp_year: 2030,
          last4: '1234',
          funding: '',
          three_d_secure_usage: null,
          brand: 'AcmeCard',
          wallet: null,
        }
      }
    ];

    const mockDonationSservice = TestBed.inject(DonationService);
    spyOn(mockDonationSservice, 'getPaymentMethods').and.returnValue(of({data: paymentMethods}));

    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;

    element = fixture.nativeElement.querySelector('main');

    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should show donor name and email', () => {
    expect(element.textContent).toContain("Generous Donor")
    expect(element.textContent).toContain("donor@example.com")
  });

  it('should show payment card number and brand', () => {
    expect(element.textContent).toContain("ACMECARD Card Ending: 1234  Expiry Date: 05/2030")
  });
});
