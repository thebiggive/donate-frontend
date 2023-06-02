/**
 * TODO: should move most of the declarations up to the parent component!!!
 */
import {CurrencyPipe} from "@angular/common";
import {Component} from "@angular/core";
import {TimeLeftPipe} from "src/app/time-left.pipe";
import {DonationStartFormParentComponent} from "./donation-start-form-parent.component";

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
  // this class intentionally left empty - it only exists as a place to hang a @Component decorator. Everything else is in parent class.
}
