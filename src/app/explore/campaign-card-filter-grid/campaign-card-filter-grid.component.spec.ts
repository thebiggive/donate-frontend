import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignCardFilterGridComponent } from './campaign-card-filter-grid.component';

describe('CampaignCardFilterGridComponent', () => {
  let component: CampaignCardFilterGridComponent;
  let fixture: ComponentFixture<CampaignCardFilterGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignCardFilterGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignCardFilterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
