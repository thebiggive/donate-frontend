import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { Campaign } from '../campaign.model';
import { TBG_DONATE_STORAGE } from '../donation.service';
import { DonationStartComponent } from './donation-start.component';
import { CampaignDetailsCardComponent } from '../campaign-details-card/campaign-details-card.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('DonationStartComponent', () => {
  (window as any).gtag = (...args: any[]) => args;

  let component: DonationStartComponent;
  let fixture: ComponentFixture<DonationStartComponent>;

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
        [
          {
            description: 'budget line 1',
            amount: 2000.01,
          },
        ],
        'The Big Give Match Fund',
        {
          id: '0011r00002HHAprAAH',
          name: 'Awesome Charity',
          donateLinkId: 'SFIdOrLegacyId',
          optInStatement: 'Opt in statement.',
          regulatorNumber: '123456',
          regulatorRegion: 'Scotland',
          stripeAccountId: campaignId === 'testCampaignIdForStripe' ? 'testStripeAcctId' : undefined,
          website: 'https://www.awesomecharity.co.uk',
        },
        {
          charityOptIn: 'Yes, I\'m happy to receive emails from',
          charityOptOut: 'No, I would not like to receive emails from',
          charityOptOutMessage: 'Please note that you might continue to receive communications from the charity if you have already shared your details with them via other methods.',
          tbgOptIn: 'Yes, I\'m happy to receive emails from',
          tbgOptOut: 'No, I would not like to receive emails from',
          tbgOptOutMessage: 'By selecting \'no\', we will no longer be able to email you about opportunities to double your donation.',
          championOptIn: 'Yes, I\'m happy to receive emails from',
          championOptOut: 'No, I would not like to receive emails from',
          championOptOutMessage: 'Please note that you might continue to receive communications from the champion if you have already shared your details with them via other methods.',
        },
        4,
        new Date(),
        [
          {
            description: 'Can buy you 2 things',
            amount: 50.01,
          },
        ],
        'Impact reporting plan',
        'Impact overview',
        true,
        987.00,
        988.00,
        'The situation',
        [
          {
            quote: 'Some quote',
            person: 'Someones quote',
          },
        ],
        'The solution',
        new Date(),
        'Active',
        'Some long summary',
        2000.01,
        'Some title',
        [],
        'Some information about what happens if funds are not used',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          provider: 'youtube',
          key: '1G_Abc2delF',
        },
    );
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DonationStartComponent,
        TimeLeftPipe,
        CampaignDetailsCardComponent,
      ],
      imports: [
        BrowserTransferStateModule,
        HttpClientTestingModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatDialogModule,
        FlexLayoutModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'donate/:campaignId',
            component: DonationStartComponent,
          },
        ]),
      ],
      providers: [
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no errors with valid inputs and get correct expected amounts', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: '20',
      },
      giftAid: {
        giftAid: true,
        homeAddress: null,
        homePostcode: null,
      },
      personalAndMarketing: {
        firstName: 'Ezra',
        lastName: 'Furman',
        emailAddress: 'test@example.com',
        optInCharityEmail: false,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: 'N1 1AA',
      },
    });

    expect(component.donationForm.valid).toBe(true);
    expect(component.expectedMatchAmount()).toBe(0); // Test has no campaign for now
    expect(component.expectedTotalAmount()).toBe(1542.5);
    expect(component.tipAmount()).toBe(20);
  });

  it('should have an error with required radio buttons not set', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '1234',
        tipAmount: null,
      },
      giftAid: {
        giftAid: null,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        optInCharityEmail: null,
        optInTbgEmail: null,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: null,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    expect(component.donationForm.controls.amounts.get('donationAmount')?.errors).toBeNull();

    const giftAidErrors: any = component.donationForm.controls.giftAid.get('giftAid')?.errors;
    expect(Object.keys(giftAidErrors).length).toBe(1);
    expect(giftAidErrors.required).toBe(true);

    const optInCharityEmailErrors: any = component.donationForm.controls.personalAndMarketing.get('optInCharityEmail')?.errors;
    expect(Object.keys(optInCharityEmailErrors).length).toBe(1);
    expect(optInCharityEmailErrors.required).toBe(true);

    const optInTbgEmailErrors: any = component.donationForm.controls.personalAndMarketing.get('optInTbgEmail')?.errors;
    expect(Object.keys(optInTbgEmailErrors).length).toBe(1);
    expect(optInTbgEmailErrors.required).toBe(true);
  });

  it('should have missing amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: null,
        tipAmount: null,
      },
      giftAid: {
        giftAid: true,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: false,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: null,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have minimum amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '0', // Simpler for now than testing e.g. '0.99' which also fails pattern validation
        tipAmount: null,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: false,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: null,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.min).toBe(true);

    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have maximum amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '25001',
        tipAmount: null,
      },
      giftAid: {
        giftAid: false,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        optInCharityEmail: false,
        optInTbgEmail: false,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: null,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.max).toBe(true);

    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have mis-formatted amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '8765,21',
        tipAmount: null,
      },
      giftAid: {
        giftAid: true,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: 'test@example.com',
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: 'N1 1AA',
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.pattern).toEqual({
      requiredPattern: '^£?[0-9]+?(\\.00)?$',
      actualValue: '8765,21',
    });

    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.personalAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have missing postcode error in Stripe mode', () => {
    // Need to override the default fixture in beforeEach() to set a realistic `campaign`.
    fixture = TestBed.createComponent(DonationStartComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
    fixture.detectChanges();

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
      },
      giftAid: {
        giftAid: true,
        homeAddress: null,
        homePostcode: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: 'test@example.com',
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: null,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const billingPostcodeErrors: any = component.donationForm.controls.paymentAndAgreement.get('billingPostcode')?.errors;
    expect(Object.keys(billingPostcodeErrors).length).toBe(1);
    expect(billingPostcodeErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
  });

  it('should have missing email address error in Stripe mode', () => {
    // Need to override the default fixture in beforeEach() to set a realistic `campaign`.
    fixture = TestBed.createComponent(DonationStartComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForStripe');
    fixture.detectChanges();

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
      },
      giftAid: {
        giftAid: true,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: true,
      },
      paymentAndAgreement: {
        billingPostcode: 'N1 1AA',
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const emailAddressErrors: any = component.donationForm.controls.personalAndMarketing.get('emailAddress')?.errors;
    expect(Object.keys(emailAddressErrors).length).toBe(1);
    expect(emailAddressErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
  });

  it('should not have missing email address error in Enthuse mode', () => {
    // Need to override the default fixture in beforeEach() to set a realistic `campaign`.
    fixture = TestBed.createComponent(DonationStartComponent);
    component = fixture.componentInstance;
    component.campaign = getDummyCampaign('testCampaignIdForEnthuse');
    fixture.detectChanges();

    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
      },
      giftAid: {
        giftAid: true,
        homePostcode: null,
        homeAddress: null,
      },
      personalAndMarketing: {
        firstName: null,
        lastName: null,
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: true,
        optInChampionEmail: false,
      },
      paymentAndAgreement: {
        billingPostcode: 'N1 1AA',
      },
    });

    expect(component.donationForm.valid).toBe(true);

    expect(component.donationForm.controls.personalAndMarketing.get('emailAddress')?.errors).toBeNull();
    expect(component.donationForm.controls.giftAid.get('giftAid')?.errors).toBeNull();
  });
});
