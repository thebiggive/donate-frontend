import {NgModule} from "@angular/core";
import {ExactCurrencyPipe} from "../exact-currency.pipe";

@NgModule({
  imports: [
    ExactCurrencyPipe,
  ],
  providers: [
    ExactCurrencyPipe,
  ]
})
export class DonationStartFormModule {}
