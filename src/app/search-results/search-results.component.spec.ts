import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatIconModule, MatGridListModule, MatProgressBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignCardComponent,
        SearchResultsComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatGridListModule,
        MatProgressBarModule,
        RouterTestingModule.withRoutes([
          {
            path: 'search',
            component: SearchResultsComponent,
          },
        ]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
