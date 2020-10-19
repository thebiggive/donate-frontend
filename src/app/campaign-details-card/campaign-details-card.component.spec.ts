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
