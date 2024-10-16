import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NgZone, Renderer2} from '@angular/core';

import {DonationTippingSliderComponent} from './donation-tipping-slider.component';
import {ViewportRuler} from "@angular/cdk/scrolling";

describe('DonationTippingSliderComponent', () => {
  let component: DonationTippingSliderComponent;
  let fixture: ComponentFixture<DonationTippingSliderComponent>;

  const dummyRenderer = {listen: () => { }} as unknown as Renderer2;
  const dummyViewportRuler = {change: () => ({subscribe: () => {}})} as unknown as ViewportRuler;
  const dummyZone = undefined as unknown as NgZone;

  it('should create', async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
      const expectedPercentage = args[1];

      const slider =  new DonationTippingSliderComponent(dummyRenderer, dummyViewportRuler, dummyZone);

      slider.donationAmount = donationAmount;
      slider.calcAndSetPercentage();

      expect(slider.selectedPercentage).toBe(expectedPercentage);
    });
    }
  );

  usingDataIt('the selected percentage is accurately calculated', [
    {position: 0, width: 10, percentageStart: 1, percentageEnd: 30, expectedPercentage: 1},
    {position: 5, width: 10, percentageStart: 1, percentageEnd: 30, expectedPercentage: 16},
    {position: 50, width: 10, percentageStart: 1, percentageEnd: 30, expectedPercentage: 30},
    {position: 0, width: 10, percentageStart: 10, percentageEnd: 30, expectedPercentage: 10},
    {position: -5, width: 10, percentageStart: 10, percentageEnd: 30, expectedPercentage: 10},
  ], function (name: string, args: {position: number, width: number, percentageStart:number, percentageEnd: number, expectedPercentage: number }){
    it(name, () => {
      const slider =  new DonationTippingSliderComponent(dummyRenderer, dummyViewportRuler, dummyZone);
      slider.isMoving = true;
      slider.position = args.position;
      slider.width = args.width;
      slider.percentageStart = args.percentageStart
      slider.percentageEnd = args.percentageEnd;

      slider.calcAndSetPercentage();

      expect(slider.selectedPercentage).toBe(args.expectedPercentage);
    })});

  it('Gives exact percentage tip for small donations', () => {
    const slider = new DonationTippingSliderComponent(dummyRenderer, dummyViewportRuler, dummyZone);
    slider.donationAmount = 54.5;
    slider.selectedPercentage = 50;

    slider.calcAndSetTipAmount();

    expect(slider.tipAmount).toBe(27.25);
  });

  it('Rounds up Tip Amount for large donations', () => {
    const slider = new DonationTippingSliderComponent(dummyRenderer, dummyViewportRuler, dummyZone);
    slider.donationAmount = 55;
    slider.selectedPercentage = 50;

    slider.calcAndSetTipAmount();

    expect(slider.tipAmount).toBe(28);
  });

  /**
   * Based on function given at
   * https://www.ontestautomation.com/data-driven-javascript-tests-using-jasmine/
   * If we use this a lot maybe move into separate file or find a data-driven testing library
   */
  function usingDataIt(name: string, values: Array<any>, func: (name: string, ...args: Array<any>)  => void) {
    for(var i = 0, count = values.length; i < count; i++) {
      if(Object.prototype.toString.call(values[i]) !== '[Object Array]') {
        values[i] = [values[i]];
      }
      func(`${name} #${i} [${values[i]!.toString()}]`, ...values[i]!);
    }
  }
});
