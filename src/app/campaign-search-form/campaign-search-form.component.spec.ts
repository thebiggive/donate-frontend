import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CampaignSearchFormComponent } from './campaign-search-form.component';

describe('CampaignSearchFormComponent', () => {
  let component: CampaignSearchFormComponent;
  let fixture: ComponentFixture<CampaignSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSearchFormComponent ],
      imports: [
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with search button disabled', () => {
    expect(component).toBeTruthy();
    expect(component.searchForm.valid).toBe(false);
  });

  it('should still have search button disabled after 1 character entered', () => {
    component.searchForm.setValue({term: 'T'});

    expect(component.searchForm.valid).toBe(false);
  });

  it('should have search button enabled after 2 characters entered', () => {
    component.searchForm.setValue({term: 'Te'});

    expect(component.searchForm.valid).toBe(true);
  });
});
