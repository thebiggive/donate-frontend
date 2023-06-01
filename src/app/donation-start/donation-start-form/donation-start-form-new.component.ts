/**
 * TODO: should move most of the declarations up to the parent component!!!
 */
import {CurrencyPipe} from "@angular/common";
import {Component, ViewChild} from "@angular/core";
import {TimeLeftPipe} from "src/app/time-left.pipe";
import {DonationStartFormParentComponent} from "./donation-start-form-parent.component";
import {DonationTippingSliderComponent} from "./donation-tipping-slider/donation-tipping-slider.component";

@Component({
  selector: 'app-donation-start-form-new',
  templateUrl: './donation-start-form-new.component.html',
  styleUrls: ['./donation-start-form-new.component.scss'],
  providers: [
    CurrencyPipe,
    TimeLeftPipe,
  ]
})
export class DonationStartFormNewComponent extends DonationStartFormParentComponent {

  panelOpenState = false;
  percentage = 1;
  showCustomTipInput = false;
  @ViewChild('donationTippingSlider') tippingSlider: DonationTippingSliderComponent;

  displayCustomTipInput = () => {
    if (this.tipValue) {
      this.amountsGroup.get('tipAmount')?.setValue(this.tipValue.toString());
    }
    this.tipValue = undefined;
    this.showCustomTipInput = true;
  }

  displayPercentageTipInput = () => {
    this.showCustomTipInput = false;
    this.tippingSlider.setTipAmount(this.tipAmount());
  }
}
