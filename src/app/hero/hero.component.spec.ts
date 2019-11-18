import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatSelectModule, MatProgressBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HeroComponent } from './hero.component';
import { CampaignSearchFormComponent } from '../campaign-search-form/campaign-search-form.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeroComponent,
        CampaignSearchFormComponent,
      ],
      imports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatProgressBarModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
