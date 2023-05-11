
import { CurrencyPipe } from "@angular/common";
import { AfterContentInit, Component, ElementRef, ViewChild } from "@angular/core";
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
export class DonationStartFormNewComponent extends DonationStartFormParentComponent implements AfterContentInit {

  panelOpenState = false;
  percentage = 1;
  showCustomTipInput = false;
  @ViewChild('tippingSlider', {static: true}) tippingSlider: ElementRef;

  ngAfterContentInit(): void {
    console.log({campaign: this.campaign});
    console.log({donation: this.donation});
    console.log({tippingSlider: this.tippingSlider});
  }

  toggleTipInput(show: boolean) {
    this.showCustomTipInput = show;
  }
}
