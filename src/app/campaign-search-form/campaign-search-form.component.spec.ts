import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CampaignSearchFormComponent } from './campaign-search-form.component';
import { ExploreComponent } from '../explore/explore.component';

describe('CampaignSearchFormComponent', () => {
  let component: CampaignSearchFormComponent;
  let fixture: ComponentFixture<CampaignSearchFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'explore',
            component: ExploreComponent,
          },
        ]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with search button enabled', () => {
    expect(component).toBeTruthy();
    expect(component.searchForm.valid).toBe(true);
  });

  it('should be considered invalid after 1 character entered', () => {
    component.searchForm.setValue({term: 'T'});

    expect(component.searchForm.valid).toBe(false);
  });

  it('should be considered valid again after 2 characters entered', () => {
    component.searchForm.setValue({term: 'Te'});

    expect(component.searchForm.valid).toBe(true);
  });
});
