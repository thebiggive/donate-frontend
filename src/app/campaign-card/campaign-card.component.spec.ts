import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';

import { CampaignCardComponent } from './campaign-card.component';
import { CampaignSummary } from '../campaign-summary.model';

describe('CampaignCardComponent', () => {
  let component: CampaignCardComponent;
  let fixture: ComponentFixture<CampaignCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignCardComponent ],
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
    fixture = TestBed.createComponent(CampaignCardComponent);
    component = fixture.componentInstance;
    component.campaign = new CampaignSummary(
      'testCampaignId',
      123,
      ['cat1', 'cat2'],
      'Test Champion',
      { id: 'testCharityId', name: 'Test Charity' },
      new Date(),
      'https://example.com/image.png',
      true,
      400,
      new Date(),
      1230,
      'Test Campaign!',
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
  });
});
