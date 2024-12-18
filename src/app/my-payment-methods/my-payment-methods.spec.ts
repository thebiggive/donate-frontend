import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MyPaymentMethodsComponent} from "./my-payment-methods.component";
import {PaymentMethod} from "@stripe/stripe-js";
import {TBG_DONATE_STORAGE} from "../donation.service";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatomoModule} from "ngx-matomo-client";
import {TBG_DONATE_ID_STORAGE} from "../identity.service";
import {InMemoryStorageService} from "ngx-webstorage-service";
import {ActivatedRoute, RouterModule} from "@angular/router";
import { of } from "rxjs";

describe("MyPaymentMethodsComponent", () => {
  let fixture: ComponentFixture<MyPaymentMethodsComponent>;
  let element: HTMLElement;

  const paymentMethods: PaymentMethod[] = [
    {
      created: 0,
      customer: null,
      livemode: false,
      metadata: {},
      type: "card",
      object: "payment_method",
      id: "method_id",
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
        last4: "1234",
        funding: "",
        three_d_secure_usage: null,
        brand: "AcmeCard",
        wallet: null,
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatDialogModule,
        MatomoModule.forRoot({
          siteId: "",
          trackerUrl: "",
        }),
      ],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      InMemoryStorageService,
      { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
      { provide: ActivatedRoute, useValue: of({snapshot: {data: {paymentMethods}}})},
    ],
    });

    // const mockDonationSservice = TestBed.inject(DonationService);
    // spyOn(mockDonationSservice, "getPaymentMethods").and.returnValue(
    //   Promise.resolve(paymentMethods)
    // );

    fixture = TestBed.createComponent(MyPaymentMethodsComponent);
    element = fixture.nativeElement.querySelector("main");
  });

  it("should show payment card number and brand", () => {
    expect(element.textContent).toContain(
      "ACMECARD Card Ending: 1234  Expiry Date: 05/2030"
    );
  });
});
