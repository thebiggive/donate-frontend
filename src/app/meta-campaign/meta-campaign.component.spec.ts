import { CampaignSummary } from './../campaign-summary.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { Campaign } from '../campaign.model';
import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { MetaCampaignComponent } from './meta-campaign.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('MetaCampaignComponent', () => {
  let component: MetaCampaignComponent;
  let fixture: ComponentFixture<MetaCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignCardComponent,
        MetaCampaignComponent,
        TimeLeftPipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatGridListModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaCampaignComponent);
    component = fixture.componentInstance;

    component.campaign = new Campaign(
      'testMasterCampaignId',
      123,
      [],
      'https://example.com/banner.png',
      [],
      undefined,
      { id: 'tbgId', name: 'The Big Give' },
      4,
      new Date(),
      [],
      true,
      987,
      [],
      new Date(),
      'Active',
      'Test Master Campaign detail',
      undefined,
      'Test Master Campaign!',
      [],
      [],
    );
    component.children = [
      new CampaignSummary(
        'testCampaignId',
        123,
        'Test Champion',
        { id: 'testCharityId', name: 'Test Charity' },
        new Date(),
        'https://example.com/image.png',
        true,
        new Date(),
        1230,
        'Test Campaign!',
      ),
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
