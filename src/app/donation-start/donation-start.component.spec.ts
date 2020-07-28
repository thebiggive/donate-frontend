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

import { TBG_DONATE_STORAGE } from '../donation.service';
import { DonationStartComponent } from './donation-start.component';
import { CampaignDetailsCardComponent } from '../campaign-details-card/campaign-details-card.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('DonationStartComponent', () => {
  let component: DonationStartComponent;
  let fixture: ComponentFixture<DonationStartComponent>;

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

  it('should have no errors with valid inputs', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: '20',
      },
      giftAidAndBilling: {
        giftAid: true,
        billingPostcode: 'N1 1AA',
        firstName: 'Ezra',
        lastName: 'Furman',
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: 'test@example.com',
        optInCharityEmail: false,
        optInTbgEmail: true,
      },
    });

    expect(component.donationForm.valid).toBe(true);
  });

  it('should have an error with required radio buttons not set', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '1234',
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: null,
        billingPostcode: null,
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: null,
        optInCharityEmail: null,
        optInTbgEmail: null,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    expect(component.donationForm.controls.amounts.get('donationAmount')?.errors).toBeNull();

    const giftAidErrors: any = component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors;
    expect(Object.keys(giftAidErrors).length).toBe(1);
    expect(giftAidErrors.required).toBe(true);

    const optInCharityEmailErrors: any = component.donationForm.controls.emailAndMarketing.get('optInCharityEmail')?.errors;
    expect(Object.keys(optInCharityEmailErrors).length).toBe(1);
    expect(optInCharityEmailErrors.required).toBe(true);

    const optInTbgEmailErrors: any = component.donationForm.controls.emailAndMarketing.get('optInTbgEmail')?.errors;
    expect(Object.keys(optInTbgEmailErrors).length).toBe(1);
    expect(optInTbgEmailErrors.required).toBe(true);
  });

  it('should have missing amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: null,
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: true,
        billingPostcode: null,
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have minimum amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '4',
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: false,
        billingPostcode: null,
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.min).toBe(true);

    expect(component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have maximum amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '25001',
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: false,
        billingPostcode: null,
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: null,
        optInCharityEmail: false,
        optInTbgEmail: false,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.max).toBe(true);

    expect(component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have mis-formatted amount error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '8765,21',
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: true,
        billingPostcode: 'N1 1AA',
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: 'test@example.com',
        optInCharityEmail: true,
        optInTbgEmail: true,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const donationAmountErrors: any = component.donationForm.controls.amounts.get('donationAmount')?.errors;
    expect(Object.keys(donationAmountErrors).length).toBe(1);
    expect(donationAmountErrors.pattern).toEqual({
      requiredPattern: '^£?[0-9]+?(\\.00)?$',
      actualValue: '8765,21',
    });

    expect(component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInCharityEmail')?.errors).toBeNull();
    expect(component.donationForm.controls.emailAndMarketing.get('optInTbgEmail')?.errors).toBeNull();
  });

  it('should have missing postcode error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: true,
        billingPostcode: null,
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: 'test@example.com',
        optInCharityEmail: true,
        optInTbgEmail: true,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const billingPostcodeErrors: any = component.donationForm.controls.giftAidAndBilling.get('billingPostcode')?.errors;
    expect(Object.keys(billingPostcodeErrors).length).toBe(1);
    expect(billingPostcodeErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors).toBeNull();
  });

  it('should have missing email address error', () => {
    component.donationForm.setValue({
      amounts: {
        donationAmount: '£1234',
        tipAmount: null,
      },
      giftAidAndBilling: {
        giftAid: true,
        billingPostcode: 'N1 1AA',
        firstName: null,
        lastName: null,
        homeAddress: null,
        homePostcode: null,
      },
      emailAndMarketing: {
        emailAddress: null,
        optInCharityEmail: true,
        optInTbgEmail: true,
      },
    });

    expect(component.donationForm.valid).toBe(false);

    const emailAddressErrors: any = component.donationForm.controls.emailAndMarketing.get('emailAddress')?.errors;
    expect(Object.keys(emailAddressErrors).length).toBe(1);
    expect(emailAddressErrors.required).toBe(true);

    expect(component.donationForm.controls.giftAidAndBilling.get('giftAid')?.errors).toBeNull();
  });
});
