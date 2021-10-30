import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Campaign } from '../campaign.model';
import { MulticurrencyLandingComponent } from './multicurrency-landing.component';

describe('MulticurrencyLandingComponent', () => {
  let component: MulticurrencyLandingComponent;
  let fixture: ComponentFixture<MulticurrencyLandingComponent>;

  const getDummyMultiCurrencyParentCampaign = () => new Campaign(
    'testMulticurrencyCampaignId',
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
    'USD',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulticurrencyLandingComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { campaign: getDummyMultiCurrencyParentCampaign() },
            },
          },
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticurrencyLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
