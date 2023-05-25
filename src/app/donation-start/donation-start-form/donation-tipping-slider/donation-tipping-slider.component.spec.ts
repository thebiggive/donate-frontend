import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';

import { DonationTippingSliderComponent } from './donation-tipping-slider.component';

describe('DonationTippingSliderComponent', () => {
  let component: DonationTippingSliderComponent;
  let fixture: ComponentFixture<DonationTippingSliderComponent>;

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     declarations: [ DonationTippingSliderComponent ]
  //   })
  //   .compileComponents();

  //   fixture = TestBed.createComponent(DonationTippingSliderComponent);
  //   component = fixture.componentInstance;
  //   component.donationCurrency = "GBP";
  //   fixture.detectChanges();
  // });

  it('should create', async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationTippingSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationTippingSliderComponent);
    component = fixture.componentInstance;
    component.donationCurrency = "GBP";
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set the percentage defaults according to tipAmounts', () => {
    const slider =  new DonationTippingSliderComponent({
      listen: () => { },
    } as unknown as Renderer2);
    slider.donationAmount = 100;
    slider.calcAndSetPercentage();
    expect(slider.derivedPercentage).toBe(12.5);
  });

});
