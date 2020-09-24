import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { Campaign } from '../campaign.model';
import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { CampaignSearchFormComponent } from '../campaign-search-form/campaign-search-form.component';
import { CampaignSummary } from '../campaign-summary.model';
import { FiltersComponent } from './../filters/filters.component';
import { HeroComponent } from '../hero/hero.component';
import { MetaCampaignComponent } from './meta-campaign.component';
import { TickerComponent } from './../ticker/ticker.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('MetaCampaignComponent', () => {
  let component: MetaCampaignComponent;
  let fixture: ComponentFixture<MetaCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignCardComponent,
        CampaignSearchFormComponent,
        FiltersComponent,
        HeroComponent,
        MetaCampaignComponent,
        TickerComponent,
        TimeLeftPipe,
      ],
      imports: [
        BrowserTransferStateModule,
        HttpClientTestingModule,
        InfiniteScrollModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
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
      ['Aim 1'],
      123,
      [],
      'https://example.com/banner.png',
      [],
      '',
      {
        id: 'tbgId',
        name: 'The Big Give',
        donateLinkId: 'SFIdOrLegacyId',
        charityOptInStatement: 'Opt in statement.',
        website: 'https://www.thebiggive.org.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland' },
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
      'Test Master Campaign detail',
      15000,
      'Test Master Campaign!',
      [],
    );
    component.children = [
      new CampaignSummary(
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
      ),
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
