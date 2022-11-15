
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { Campaign } from '../campaign.model';
import { CampaignSummary } from '../campaign-summary.model';
import { TBG_DONATE_STORAGE } from '../donation.service';
import { MetaCampaignComponent } from './meta-campaign.component';
import { TimeLeftPipe } from '../time-left.pipe';
import { OptimisedImagePipe } from '../optimised-image.pipe';

describe('MetaCampaignComponent', () => {
  let component: MetaCampaignComponent;
  let fixture: ComponentFixture<MetaCampaignComponent>;

  const getDummyMasterCampaign = () => new Campaign(
    'testMasterCampaignId',
    ['Aim 1'],
    123,
    [],
    'https://example.com/banner.png',
    ['Other'],
    [],
    ['Animals'],
    '',
    {
      id: 'tbgId',
      name: 'The Big Give',
      donateLinkId: 'SFIdOrLegacyId',
      optInStatement: 'Opt in statement.',
      website: 'https://www.thebiggive.org.uk',
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
    'The situation',
    [],
    true,
    'The solution',
    new Date(),
    'Active',
    'Test Master Campaign detail',
    15000,
    'Test Master Campaign!',
    [],
  );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MetaCampaignComponent,
      ],
      imports: [
        AsyncPipe,
        CommonModule,
        HttpClientTestingModule,
        InfiniteScrollModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        OptimisedImagePipe,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Let constructor pipe params without crashing.
            queryParams: of({}), // Let `loadQueryParamsAndRun()` subscribe without crashing.
            snapshot: {
              data: { campaign: getDummyMasterCampaign() },
            },
          },
        },
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        InMemoryStorageService,
        TimeLeftPipe,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaCampaignComponent);
    component = fixture.componentInstance;

    component.campaign = getDummyMasterCampaign();
    component.children = [
      new CampaignSummary(
        'testCampaignId',
        123,
        ['Other'],
        ['Animals'],
        'Test Champion',
        { id: 'testCharityId', name: 'Test Charity' },
        'GBP',
        [],
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
