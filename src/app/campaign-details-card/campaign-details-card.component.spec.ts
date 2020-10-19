import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';

import { Campaign } from '../campaign.model';
import { CampaignDetailsCardComponent } from './campaign-details-card.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('CampaignDetailsCardComponent', () => {
  let component: CampaignDetailsCardComponent;
  let fixture: ComponentFixture<CampaignDetailsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignDetailsCardComponent, TimeLeftPipe ],
      imports: [
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
    fixture = TestBed.createComponent(CampaignDetailsCardComponent);
    component = fixture.componentInstance;
    component.campaign = new Campaign(
      'testCampaignId',
      ['Aim 1'],
      123,
      [],
      'https://example.com/banner.png',
      [],
      'Some Champion',
      {
        id: 'testCharityId',
        name: 'Test Charity',
        donateLinkId: 'SFIdOrLegacyId',
        optInStatement: 'Opt in statement.',
        website: 'https://www.testcharity.co.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
      },
      {
        charityOptIn: 'Charity opt in',
        charityOptOut: 'Charity opt out',
        charityOptOutMessage: 'Charity opt out message',
        tbgOptIn: 'Tbg opt in',
        tbgOptOut: 'Tbg opt out',
        tbgOptOutMessage: 'Tbg opt out message',
        championOptIn: 'Champion opt in',
        championOptOut: 'Champion opt out',
        championOptOutMessage: 'Champion opt out message',
      },
      4,
      new Date(),
      [],
      'Impact reporting plan',
      'Impact overview',
      true,
      987,
      988,
      'The situation',
      [],
      'The solution',
      new Date(),
      'Active',
      'Test campaign description',
      1234,
      'Test Campaign!',
      [],
      'Some information about what happens if funds are not used',
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
