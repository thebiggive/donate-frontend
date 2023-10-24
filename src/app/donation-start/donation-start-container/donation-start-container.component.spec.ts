import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Component} from "@angular/core";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import {ActivatedRoute} from "@angular/router";
import { MatomoModule } from 'ngx-matomo';
import {InMemoryStorageService} from "ngx-webstorage-service";
import {of} from "rxjs";

import {DonationStartContainerComponent} from "./donation-start-container.component";
import {DonationStartFormComponent} from "../donation-start-form/donation-start-form.component";
import {TBG_DONATE_ID_STORAGE} from "../../identity.service";
import {TBG_DONATE_STORAGE} from "../../donation.service";
import {Campaign} from "../../campaign.model";

// See https://medium.com/angular-in-depth/angular-unit-testing-viewchild-4525e0c7b756
@Component({
  selector: 'app-donation-start-form',
  template: '',
  providers: [
    { provide: DonationStartFormComponent, useClass: DonationStartFormStubComponent },
  ],
})
class DonationStartFormStubComponent {
  resumeDonationsIfPossible() {}
}

describe('DonationStartContainer', () => {
  let component: DonationStartContainerComponent;
  let fixture: ComponentFixture<DonationStartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DonationStartContainerComponent,
        DonationStartFormStubComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatomoModule.forRoot({
          scriptUrl: `https://example.com/matomo.js`,
          trackers: [],
          routeTracking: {
            enable: true,
          }
        }),
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
        InMemoryStorageService,
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationStartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should create and call form's donation resume helper`, () => {
    spyOn(component.donationStartForm, 'resumeDonationsIfPossible');
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
    expect(component.donationStartForm.resumeDonationsIfPossible).toHaveBeenCalled();
  });

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
});
