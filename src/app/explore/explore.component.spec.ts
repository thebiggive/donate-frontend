import { AsyncPipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatomoModule } from 'ngx-matomo-client';
import { NEVER, of } from 'rxjs';

import { ExploreComponent } from './explore.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Campaign } from '../campaign.model';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [],
      imports: [
        AsyncPipe,
        InfiniteScrollDirective,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: 'search',
            component: ExploreComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                highlights: [],
              },
            },
            queryParams: of({}), // Let `loadQueryParamsAndRun()` subscribe without crashing.
          },
        },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });
  });

  beforeEach(() => {
    const fixture = TestBed.runInInjectionContext(() => TestBed.createComponent(ExploreComponent));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show amount without Gift Aid for open campaign that raised nothing', () => {
    const campaign: Campaign = {
      id: '42',
      title: 'Some Campaign',
      amountRaised: 0,
      currencyCode: 'GBP',
      startDate: new Date().toISOString(),
    } as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe('£0 raised');
  });

  it('should show amount with Gift Aid for open campaign that raised something', () => {
    const campaign: Campaign = {
      id: '42',
      title: 'Some Campaign',
      amountRaised: 1,
      currencyCode: 'GBP',
      startDate: new Date().toISOString(),
    } as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe('£1 raised inc. Gift Aid');
  });

  it('should show something time to open for a campaign that opens tomorrow', () => {
    const dayAftertommorow = new Date(); // we don't use tommorrow because behaviour is inconsistent between 23 hours and 1 day.

    dayAftertommorow.setDate(dayAftertommorow.getDate() + 2);
    dayAftertommorow.setHours(dayAftertommorow.getHours() + 1);
    const campaign: Campaign = {
      id: '42',
      title: 'Some Campaign',
      amountRaised: 1,
      currencyCode: 'GBP',
      startDate: dayAftertommorow.toISOString(),
    } as Campaign;
    const sut = makeComponentWithCampaign(campaign);
    sut.ngOnInit();
    expect(sut.tickerMainMessage).toBe('Opens in 2 days');
  });

  function makeComponentWithCampaign(campaign: Campaign) {
    const stubRoute = { queryParams: NEVER } as unknown as ActivatedRoute;
    stubRoute.params = of({});
    stubRoute.snapshot = new ActivatedRouteSnapshot();
    stubRoute.snapshot.data = { campaign: campaign };

    TestBed.overrideProvider(ActivatedRoute, { useValue: stubRoute });

    return new ExploreComponent();
  }
});
