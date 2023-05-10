
import { CurrencyPipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { TimeLeftPipe } from "src/app/time-left.pipe";
import { DonationStartFormParentComponent } from "./donation-start-form-parent.component";

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
  @ViewChild('biggive-tipping-slider') biggiveTippingSlider: any;

  ngAfterContentInit(): void {
    console.log({campaign: this.campaign});
    console.log({donation: this.donation});
    console.log({biggiveTippingSlider: this.biggiveTippingSlider});
  }

  onDonationAmountChange(event: any) {
    const tipValue = event.explicitOriginalTarget.children[0].innerText;
    console.log({tipValue});
    const isNan = isNaN(tipValue);
    console.log(isNan);
    if (isNan) {
      // check if user didn't click away in which case the tipValue is invalid
      this.percentage = tipValue;
    }

    console.log({ tippingSliderEvent: event.explicitOriginalTarget.children[0].innerText});
    console.log({percentage: this.percentage});
  }

  toggleTipInput(show: boolean) {
    this.showCustomTipInput = show;
  }
}
