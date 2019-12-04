import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSelectModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';

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
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSearchFormComponent);
    component = fixture.componentInstance;
    component.reset = new Observable();
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
