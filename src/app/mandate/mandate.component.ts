import { Component } from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Campaign} from "../campaign.model";

@Component({
  selector: 'app-mandate',
  standalone: true,
  imports: [
    ComponentsModule,
    DatePipe,
    ExactCurrencyPipe,
    FaIconComponent,
    MatProgressSpinner
  ],
  templateUrl: './mandate.component.html',
  styleUrl: './mandate.component.css'
})
export class MandateComponent {
  complete = true;
  encodedShareUrl = '';
  encodedPrefilledText: string = '';
  donation: any = {};
  totalValue: 0;
  campaign: any = {}
  giftAidAmount: number = 0;
  totalPaid: 0;

}
