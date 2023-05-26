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

  usingDataIt('should have default percentage according to donation size', [
  // [donation , expected default percentage]
    [0, 15],
    [99, 15],
    [100, 12.5],
    [299, 12.5],
    [300, 10],
    [999, 10],
    [1000, 7.5],
    ], function (name: string, args: [number, number]){
    it(name, () => {
      const donationAmount = args[0];
      const expectedDerivedPercentage = args[1];

      const dummyRenderer = {listen: () => { }} as unknown as Renderer2;
      const slider =  new DonationTippingSliderComponent(dummyRenderer);

      slider.donationAmount = donationAmount;
      slider.calcAndSetPercentage();

      expect(slider.derivedPercentage).toBe(expectedDerivedPercentage);
    });
    }
  )

  /**
   * Based on function given at
   * https://www.ontestautomation.com/data-driven-javascript-tests-using-jasmine/
   * If we use this a lot maybe move into separate file or find a data-driven testing library
   */
  function usingDataIt(name: string, values: Array<Array<any>>, func: (name: string, ...args: Array<any>)  => void) {
    for(var i = 0, count = values.length; i < count; i++) {
      if(Object.prototype.toString.call(values[i]) !== '[Object Array]') {
        values[i] = [values[i]];
      }
      func(`${name} #${i} [${values[i]!.toString()}]`, ...values[i]!);
    }
  }
});
