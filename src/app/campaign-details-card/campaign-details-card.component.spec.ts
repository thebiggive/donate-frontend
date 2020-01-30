import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatSelectModule, MatProgressBarModule } from '@angular/material';
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
        website: 'https://www.testcharity.co.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
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
