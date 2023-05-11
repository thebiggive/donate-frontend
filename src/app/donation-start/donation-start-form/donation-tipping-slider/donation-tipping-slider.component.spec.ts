import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationTippingSliderComponent } from './donation-tipping-slider.component';

describe('DonationTippingSliderComponent', () => {
  let component: DonationTippingSliderComponent;
  let fixture: ComponentFixture<DonationTippingSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationTippingSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationTippingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
