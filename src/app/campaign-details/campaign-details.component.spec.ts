import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatProgressBarModule, MatTabsModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { Campaign } from '../campaign.model';
import { CampaignDetailsCardComponent } from '../campaign-details-card/campaign-details-card.component';
import { CampaignDetailsComponent } from './campaign-details.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('CampaignDetailsComponent', () => {
  let component: CampaignDetailsComponent;
  let fixture: ComponentFixture<CampaignDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignDetailsComponent, CampaignDetailsCardComponent, TimeLeftPipe ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatProgressBarModule,
        MatTabsModule,
        NoopAnimationsModule,
        RouterTestingModule,
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
      [],
      'Some Champion',
      { id: 'testCharityId', name: 'Test Charity' },
      4,
      new Date(),
      [],
      'Impact reporting plan',
      'Impact overview',
      true,
      987,
      'The situation',
      [],
      'The solution',
      new Date(),
      'Active',
      'Test campaign description',
      1234,
      'Test Campaign!',
      [],
      {
        provider: 'youtube',
        key: 'someFakeKey',
      },
      'Some information about what happens if funds are not used',
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load key data from test campaign', () => {
    expect(component.campaign.title).toBe('Test Campaign!');
    expect(component.campaign.isMatched).toBe(true);
    expect(component.campaign.charity.name).toBe('Test Charity');
    expect(component.campaign.aims[0]).toBe('Aim 1');
    expect(component.campaign.video.provider).toBe('youtube');
  });
});
