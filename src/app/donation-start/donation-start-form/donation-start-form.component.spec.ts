import {DatePipe} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {RecaptchaModule} from 'ng-recaptcha';
import {MatomoTracker as MatomoClientTracker, MatomoModule} from 'ngx-matomo-client';
import {InMemoryStorageService} from 'ngx-webstorage-service';
import {of} from 'rxjs';

import {Campaign} from '../../campaign.model';
import {DonationService, TBG_DONATE_STORAGE} from '../../donation.service';
import {IdentityService, TBG_DONATE_ID_STORAGE} from '../../identity.service';
import {TimeLeftPipe} from "../../time-left.pipe";
import {DonationStartFormComponent} from "./donation-start-form.component";
import {CardIconsService} from "../../card-icons.service";
import {ChangeDetectorRef, ElementRef} from "@angular/core";
import {ConversionTrackingService} from "../../conversionTracking.service";
import {PageMetaService} from "../../page-meta.service";
import {PostcodeService} from "../../postcode.service";
import {StripeService} from "../../stripe.service";
import {Donation} from "../../donation.model";
import {MatSnackBar} from '@angular/material/snack-bar';

function makeDonationStartFormComponent(donationService: DonationService,) {
  const mockIdentityService = TestBed.inject(IdentityService);
  spyOn(mockIdentityService, 'isTokenForFinalisedUser').and.returnValue(true);

  const donationStartFormComponent = new DonationStartFormComponent(
    undefined as unknown as CardIconsService,
    undefined as unknown as ChangeDetectorRef,
    {
      convert: () => {
      }
    } as unknown as ConversionTrackingService,
    undefined as unknown as MatDialog,
    donationService,
    undefined as unknown as ElementRef<any>,
    new FormBuilder(),
    mockIdentityService,
    {
      trackEvent: () => {
      }
    } as unknown as MatomoClientTracker,
    undefined as unknown as PageMetaService,
    undefined as unknown as PostcodeService,
    {},
    {snapshot: {}} as unknown as ActivatedRoute,
    {
      navigate: () => {
      }
    } as unknown as Router,
    undefined as unknown as StripeService,
    undefined as unknown as DatePipe,
    undefined as unknown as TimeLeftPipe,
    {
      open: () => {}
    } as unknown as MatSnackBar,
  );

  donationStartFormComponent.campaign = {currencyCode: 'GBP'} as Campaign;

  donationStartFormComponent.donation = {} as Donation;
  return donationStartFormComponent;
}

describe('DonationStartForm', () => {
  let component: DonationStartFormComponent;
  let fixture: ComponentFixture<DonationStartFormComponent>;

  const getDummyCampaign = (campaignId: string) => {
    return new Campaign(
      campaignId,
        ['Aim 1'],
        200.00,
        [
          {
            uri: 'https://example.com/some-additional-image.png',
            order: 100,
          },
        ],
        'https://example.com/some-banner.png',
        ['Other'],
        [
          {
            description: 'budget line 1',
            amount: 2000.01,
          },
        ],
        ['Animals'],
        'Big Give Match Fund',
        {
          id: '0011r00002HHAprAAH',
          name: 'Awesome Charity',
          optInStatement: 'Opt in statement.',
          regulatorNumber: '123456',
          regulatorRegion: 'Scotland',
          stripeAccountId: campaignId === 'testCampaignIdForStripe' ? 'testStripeAcctId' : undefined,
          website: 'https://www.awesomecharity.co.uk',
        },
        ['United Kingdom'],
        'GBP',
        4,
        new Date('2050-01-01T00:00:00'),
        'Impact reporting plan',
        'Impact overview',
        true,
        987.00,
        988.00,
        false,
        'The situation',
        [
          {
            quote: 'Some quote',
            person: 'Someones quote',
          },
        ],
        true,
        'The solution',
        new Date(),
        'Active',
        'Some long summary',
        'Some title',
        [],
        false,
        'Some information about what happens if funds are not used',
        undefined,
        undefined,
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        2000.01,
        undefined,
        {
          provider: 'youtube',
          key: '1G_Abc2delF',
        },
    );
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatStepperModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RouterTestingModule.withRoutes([
          {
            path: 'donate/:campaignId',
            component: DonationStartFormComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: {
              data: { campaign: getDummyCampaign('testCampaignIdForStripe') },
            },
          },
        },
        DatePipe,
        InMemoryStorageService,
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
    // Don't `fixture.detectChanges()` here, so tests can vary their route-resolved campaign.
  });

  it('should create', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    expect(component).toBeTruthy();
  });

  it('should have no errors with valid inputs, including for UK Gift Aid, and get correct expected amounts', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: '20',
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: true,
        homeAddress: '123 Main St',
        homeBuildingNumber: '123',
        homePostcode: 'N1 1AA',
        homeOutsideUK: false,
      },
      payment: {
        firstName: 'Ezra',
        lastName: 'Furman',
        emailAddress: 'test@example.com',
        billingCountry: 'GB',
        billingPostcode: 'N1 1AA',
      },
      marketing: {
        optInCharityEmail: false,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(true);
    // Expected match is £0 until donation set up + funds actually reserved.
    expect(component.expectedMatchAmount()).toBe(0);
    expect(component.expectedTotalAmount()).toBe(1542.5);
    // Now we have the percentage field loading fully with `campaign` coming from
    // a route resolver, we expect this to get set dynamically from the 12.5%
    // deafult.
    expect(component.amountsGroup.get('tipPercentage')?.value).toBe(12.5);
    expect(component.tipAmount()).toBe(154.25);
  });

  /**
   * homePostcode is not required in this scenario.
   */
  it('should have no errors with a non-UK-resident claim for UK Gift Aid', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: '20',
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: true,
        homeAddress: '123 Main St',
        homeBuildingNumber: '123',
        homePostcode: null,
        homeOutsideUK: true,
      },
      payment: {
        firstName: 'Ezra',
        lastName: 'Furman',
        emailAddress: 'test@example.com',
        billingCountry: 'GB',
        billingPostcode: 'N1 1AA',
      },
      marketing: {
        optInCharityEmail: false,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(true);
  });

  it('should have an error with required radio buttons not set', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '1234',
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: null,
        homePostcode: null,
        homeAddress: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        billingCountry: null,
        billingPostcode: null,
      },
      marketing: {
        optInCharityEmail: null,
        optInTbgEmail: null,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    expect(component.donationForm.controls.amounts!.get('donationAmount')?.errors).toBeNull();

    const optInCharityEmailErrors: any = component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors;
    expect(Object.keys(optInCharityEmailErrors).length).toBe(1);
    expect(optInCharityEmailErrors.required).toBe(true);

    const optInTbgEmailErrors: any = component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors;
    expect(Object.keys(optInTbgEmailErrors).length).toBe(1);
    expect(optInTbgEmailErrors.required).toBe(true);
  });

  it('should have missing amount error', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: null,
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        billingCountry: null,
        billingPostcode: null,
      },
      marketing: {
        optInCharityEmail: true,
        optInTbgEmail: false,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have minimum amount error', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '0', // Simpler for now than testing e.g. '0.99' which also fails pattern validation
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        billingCountry: null,
        billingPostcode: null,
      },
      marketing: {
        optInCharityEmail: true,
        optInTbgEmail: false,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.min).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('Should not allow paying with with no payment method and no funds', async () => {
    var finaliseCashBalancePurchaseCalled = false;

    const fakeDonationService = {
      getDefaultCounty: () => 'GB',
      finaliseCashBalancePurchase: (donation: Donation)=> {
        finaliseCashBalancePurchaseCalled = true;
        return of(donation);
      },
      getPaymentMethods: () => of({data: []}),
    } as unknown as DonationService;

    const sut = makeDonationStartFormComponent(fakeDonationService);

    // Ensure form groups are ready, otherwise we get lots of errors from validation updates
    // etc. on undefined elements.
    await waitForAsync(() => {
      sut.loadPerson({cash_balance: {gbp: 0}}, 'personID', 'jwt');
    });

    await sut.payWithStripe({saveCardForReuse});

    expect(finaliseCashBalancePurchaseCalled).toBe(false)
  });



  it('should have maximum amount error', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '25001',
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        billingCountry: null,
        billingPostcode: null,
      },
      marketing: {
        optInCharityEmail: true,
        optInTbgEmail: false,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.max).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have mis-formatted amount error', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '8765,21',
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: 'test@example.com',
        billingCountry: 'GB',
        billingPostcode: 'N1 1AA',
      },
      marketing: {
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.pattern).toEqual({
      requiredPattern: '^\\s*[£$]?[0-9]+?(\\.00)?\\s*$',
      actualValue: '8765,21',
    });

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have missing country & postcode & Gift Aid errors in Stripe + UK mode', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: null,
        homeAddress: null,
        homePostcode: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: 'test@example.com',
        billingCountry: null,
        billingPostcode: null,
      },
      marketing: {
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const billingCountryErrors: any = component.donationForm.controls.payment!.get('billingPostcode')?.errors;
    expect(Object.keys(billingCountryErrors).length).toBe(1);
    expect(billingCountryErrors.required).toBe(true);

    const billingPostcodeErrors: any = component.donationForm.controls.payment!.get('billingPostcode')?.errors;
    expect(Object.keys(billingPostcodeErrors).length).toBe(1);
    expect(billingPostcodeErrors.required).toBe(true);

    const giftAidErrors: any = component.donationForm.controls.giftAid!.get('giftAid')?.errors;
    expect(Object.keys(giftAidErrors).length).toBe(1);
    expect(giftAidErrors.required).toBe(true);
  });

  it('should have missing email address error in Stripe mode', () => {
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
        tipPercentage: 12.5,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
        homeBuildingNumber: null,
        homeOutsideUK: null,
      },
      payment: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        billingCountry: 'GB',
        billingPostcode: 'N1 1AA',
      },
      marketing: {
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: true,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const emailAddressErrors: any = component.donationForm.controls.payment!.get('emailAddress')?.errors;
    expect(Object.keys(emailAddressErrors).length).toBe(1);
    expect(emailAddressErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
  });
});
