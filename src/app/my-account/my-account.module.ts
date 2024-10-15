import { AsyncPipe, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { allChildComponentImports } from "../../allChildComponentImports";
import { ExactCurrencyPipe } from "../exact-currency.pipe";
import { OptimisedImagePipe } from "../optimised-image.pipe";
import { MyAccountRoutingModule } from "./my-account-routing.module";
import { MyAccountComponent } from "./my-account.component";

@NgModule({
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    ExactCurrencyPipe,
    MyAccountRoutingModule,
    MatProgressSpinnerModule,
    OptimisedImagePipe,
    MatButtonModule,
    MatDialogModule,
    FontAwesomeModule,
  ],
  declarations: [MyAccountComponent],
  providers: [DatePipe],
})
export class MyAccountModule {}
