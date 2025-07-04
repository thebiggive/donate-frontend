import { DatePipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatomoModule } from 'ngx-matomo-client';
import { MatomoTestingModule } from 'ngx-matomo-client/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { Campaign } from '../../campaign.model';
import { DonationService, TBG_DONATE_STORAGE } from '../../donation.service';
import { IdentityService } from '../../identity.service';
import { TimeLeftPipe } from '../../time-left.pipe';
import { DonationStartFormComponent } from './donation-start-form.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Donation } from '../../donation.model';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('DonationStartForm', () => {
  let component: DonationStartFormComponent;
  let fixture: ComponentFixture<DonationStartFormComponent>;

  const getDummyCampaign = (campaignId: string): Campaign => {
    return {
      id: campaignId,
      aims: ['Aim 1'],
      amountRaised: 200.0,
      additionalImageUris: [
        {
          uri: 'https://example.com/some-additional-image.png',
          order: 100,
        },
      ],
      bannerUri: 'https://example.com/some-banner.png',
      beneficiaries: ['Other'],
      budgetDetails: [
        {
          description: 'budget line 1',
          amount: 2000.01,
        },
      ],
      categories: ['Animals'],
      championName: 'Big Give Match Fund',
      isRegularGiving: false,
      charity: {
        id: '0011r00002HHAprAAH',
        name: 'Awesome Charity',
        optInStatement: 'Opt in statement.',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
        stripeAccountId: campaignId === 'testCampaignIdForStripe' ? 'testStripeAcctId' : undefined,
        website: 'https://www.awesomecharity.co.uk',
      },
      countries: ['United Kingdom'],
      currencyCode: 'GBP',
      donationCount: 4,
      endDate: '2050-01-01T00:00:00',
      impactReporting: 'Impact reporting plan',
      impactSummary: 'Impact overview',
      isMatched: true,
      matchFundsRemaining: 987.0,
      matchFundsTotal: 988.0,
      parentUsesSharedFunds: false,
      problem: 'The situation',
      quotes: [
        {
          quote: 'Some quote',
          person: 'Someones quote',
        },
      ],
      ready: true,
      solution: 'The solution',
      startDate: new Date().toISOString(),
      status: 'Active',
      summary: 'Some long summary',
      title: 'Some title',
      updates: [],
      alternativeFundUse: 'Some information about what happens if funds are not used',
      championOptInStatement: undefined,
      championRef: undefined,
      hidden: false,
      logoUri: undefined,
      parentRef: undefined,
      surplusDonationInfo: undefined,
      target: 2000.01,
      thankYouMessage: undefined,
      video: {
        provider: 'youtube',
        key: '1G_Abc2delF',
      },
    };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatStepperModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
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
        TimeLeftPipe,
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: MatomoModule, useClass: MatomoTestingModule },
      ],
    });
  });

  it('should create', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
    fixture.detectChanges(); // Detect initial state from async beforeEach(), including Stripe-enabled charity.

    expect(component).toBeTruthy();
  });

  it('should have no errors with valid inputs, including for UK Gift Aid, and get correct expected amounts', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const optInCharityEmailErrors: any = component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors;
    expect(Object.keys(optInCharityEmailErrors).length).toBe(1);
    expect(optInCharityEmailErrors.required).toBe(true);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const optInTbgEmailErrors: any = component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors;
    expect(Object.keys(optInTbgEmailErrors).length).toBe(1);
    expect(optInTbgEmailErrors.required).toBe(true);
  });

  it('should have missing amount error', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have minimum amount error', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.min).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('Should not allow paying with with no payment method and no funds', async () => {
    let finaliseCashBalancePurchaseCalled = false;

    const fakeDonationService = {
      getDefaultCounty: () => 'GB',
      finaliseCashBalancePurchase: (donation: Donation) => {
        finaliseCashBalancePurchaseCalled = true;
        return of(donation);
      },
      getPaymentMethods: () => of({ data: [] }),
    } as unknown as DonationService;

    TestBed.overrideProvider(DonationService, { useValue: fakeDonationService });

    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');

    const identityService = TestBed.inject(IdentityService);
    spyOn(identityService, 'isTokenForFinalisedUser').and.returnValue(true);

    fixture.detectChanges();

    // Ensure form groups are ready, otherwise we get lots of errors from validation updates
    // etc. on undefined elements.
    await waitForAsync(() => {
      component.loadPerson({ cash_balance: { gbp: 0 } }, 'jwt');
    });

    await component.payWithStripe();

    expect(finaliseCashBalancePurchaseCalled).toBe(false);
  });

  it('should have maximum amount error', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const donationAmountErrors: any = component.donationForm.controls.amounts!.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.max).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.marketing!.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have mis-formatted amount error', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const billingCountryErrors: any = component.donationForm.controls.payment!.get('billingPostcode')?.errors;
    expect(Object.keys(billingCountryErrors).length).toBe(1);
    expect(billingCountryErrors.required).toBe(true);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const billingPostcodeErrors: any = component.donationForm.controls.payment!.get('billingPostcode')?.errors;
    expect(Object.keys(billingPostcodeErrors).length).toBe(1);
    expect(billingPostcodeErrors.required).toBe(true);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const giftAidErrors: any = component.donationForm.controls.giftAid!.get('giftAid')?.errors;
    expect(Object.keys(giftAidErrors).length).toBe(1);
    expect(giftAidErrors.required).toBe(true);
  });

  it('should have missing email address error in Stripe mode', () => {
    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
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

    const emailAddressErrors = component.donationForm.controls.payment!.get('emailAddress')?.errors;
    expect(Object.keys(emailAddressErrors!).length).toBe(1);
    expect(emailAddressErrors!.required).toBe(true);

    expect(component.donationForm.controls.giftAid!.get('giftAid')?.errors).toBeNull();
  });
});
