import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaCampaignComponent } from './meta-campaign.component';

describe('MetaCampaignComponent', () => {
  let component: MetaCampaignComponent;
  let fixture: ComponentFixture<MetaCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
