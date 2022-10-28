import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotedCampaignsComponent } from './promoted-campaigns.component';

describe('PromotedCampaignsComponent', () => {
  let component: PromotedCampaignsComponent;
  let fixture: ComponentFixture<PromotedCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotedCampaignsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotedCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
