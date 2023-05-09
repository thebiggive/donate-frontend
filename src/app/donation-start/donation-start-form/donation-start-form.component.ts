
import { CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { TimeLeftPipe } from "src/app/time-left.pipe";
import { DonationStartFormParentComponent } from "./donation-start-form-parent.component";
@Component({
  selector: 'app-donation-start-form',
  templateUrl: './donation-start-form.component.html',
  styleUrls: ['./donation-start-form.component.scss'],
  providers: [
    CurrencyPipe,
    TimeLeftPipe,
  ]
})
export class DonationStartFormComponent extends DonationStartFormParentComponent {

}
