import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { Campaign } from '../campaign.model';
import { CampaignDetailsComponent } from './campaign-details.component';
import { OptimisedImagePipe } from '../optimised-image.pipe';
import { TimeLeftPipe } from '../time-left.pipe';

describe('CampaignDetailsComponent', () => {
  let component: CampaignDetailsComponent;
  let fixture: ComponentFixture<CampaignDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignDetailsComponent,
      ],
      imports: [
        CommonModule,
        CurrencyPipe,
        HttpClientTestingModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        NoopAnimationsModule,
        OptimisedImagePipe,
        RouterTestingModule,
      ],
      providers: [
        TimeLeftPipe,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDetailsComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign(
      'testCampaignId',
      ['Aim 1'],
      123,
      [],
      'https://example.com/banner.png',
      ['Other'],
      [],
      ['Animals'],
      'Some Champion',
      {
        id: 'testCharityId',
        name: 'Test Charity',
        optInStatement: 'Opt in statement.',
        website: 'https://www.testcharity.co.uk',
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
      987,
      988,
      false,
      'The situation',
      [],
      true,
      'The solution',
      new Date(),
      'Active',
      'Test campaign description',
      'Test Campaign!',
      [],
      false,
      'Some information about what happens if funds are not used',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1234,
      undefined,
      {
        provider: 'youtube',
        key: 'someFakeKey',
      },
    );
    // For now, *don't* detect changes as ngOnInit() will clear out the fixed `campaign` trying to
    // read a value from the state transfer service. TODO it would be better to mock an HTTP response
    // instead so the data is loaded in a more realistic way.
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load key data from test campaign', () => {
    if (!component.campaign) {
      expect(false).toBeTrue(); // campaign unexpectedly undefined
      return;
    }
    expect(component.campaign.title).toBe('Test Campaign!');
    expect(component.campaign.isMatched).toBe(true);
    expect(component.campaign.charity.name).toBe('Test Charity');
    expect(component.campaign.aims[0]).toBe('Aim 1');
    expect(component.campaign.video).toBeDefined();
    if (component.campaign.video) {
      expect(component.campaign.video.provider).toBe('youtube');
    } else {
      expect(false).toBeTrue(); // video unexpectedly undefined
    }
  });
});
