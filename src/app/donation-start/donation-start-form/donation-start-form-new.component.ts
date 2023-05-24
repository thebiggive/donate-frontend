
import { CurrencyPipe } from "@angular/common";
import { AfterContentInit, Component, ViewChild, OnChanges  } from "@angular/core";
import { TimeLeftPipe } from "src/app/time-left.pipe";
import { DonationStartFormParentComponent } from "./donation-start-form-parent.component";
import { DonationTippingSliderComponent } from "./donation-tipping-slider/donation-tipping-slider.component";

@Component({
  selector: 'app-donation-start-form-new',
  templateUrl: './donation-start-form-new.component.html',
  styleUrls: ['./donation-start-form-new.component.scss'],
  providers: [
    CurrencyPipe,
    TimeLeftPipe,
  ]
})
export class DonationStartFormNewComponent extends DonationStartFormParentComponent implements AfterContentInit, OnChanges {

  panelOpenState = false;
  percentage = 1;
  showCustomTipInput = false;
  @ViewChild('tippingSlider') tippingSlider: DonationTippingSliderComponent;

  // ngAfterContentInit(): void {
  //   console.log('form new component, ngAfterContentInit: ');
  //   console.log({campaign: this.campaign});
  //   console.log({donation: this.donation});
  //   console.log({tippingSlider: this.tippingSlider});
  //   console.log({tipAmount: this.customTipAmount})
  //   console.log({customTipAmount: this.customTipAmount})
  // }

  ngOnChanges(): void {
      console.log('form new component, ngOnChanges: ');
      console.log({campaign: this.campaign});
      console.log({donation: this.donation});
      console.log({tippingSlider: this.tippingSlider});
  }

  toggleTipInput = () => {
    this.showCustomTipInput = this.showCustomTipInput === true ? false : true;
    console.log({tipAmount: this.tipAmount()});
  }
  
}
