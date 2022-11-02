import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CampaignPromoCardComponent } from './campaign-promo-card.component';
import { Campaign } from '../campaign.model';

describe('CampaignPromoCardComponent', () => {
  let component: CampaignPromoCardComponent;
  let fixture: ComponentFixture<CampaignPromoCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FontAwesomeModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatSelectModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignPromoCardComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign(
      'a051r00001EywjpAAB',
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
      'The Big Give Match Fund',
      {
        id: 'sfCharityAsd1',
        name: 'The Test Charity',
        donateLinkId: 'SFIdOrLegacyId',
        optInStatement: 'Opt in statement.',
        website: 'https://www.awesomecharity.co.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
      },
      ['United Kingdom'],
      'GBP',
      4,
      new Date(),
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
      true,
      'The solution',
      new Date(),
      'Active',
      'Some long summary',
      2000.01,
      'The Test Campaign',
      [],
      'Some information about what happens if funds are not used',
      undefined,
      undefined,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load key data from test campaign', () => {
    expect(component.campaign.title).toBe('The Test Campaign');
    expect(component.campaign.isMatched).toBe(true);
    expect(component.campaign.charity.name).toBe('The Test Charity');
  });
});
