import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PromotedCampaignsComponent } from './promoted-campaigns.component';
import { routes } from '../app-routing';

describe('PromotedCampaignsComponent', () => {
  let component: PromotedCampaignsComponent;
  let fixture: ComponentFixture<PromotedCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        RouterTestingModule.withRoutes(routes),
      ],
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
