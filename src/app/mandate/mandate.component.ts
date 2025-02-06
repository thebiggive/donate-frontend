import {Component, OnInit} from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {Mandate} from "../mandate.model";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {ActivatedRoute} from "@angular/router";
import {MoneyPipe} from "../money.pipe";

@Component({
  selector: 'app-mandate',
  standalone: true,
  imports: [
    ComponentsModule,
    DatePipe,
    ExactCurrencyPipe,
    MoneyPipe
  ],
  templateUrl: './mandate.component.html',
  styleUrl: './mandate.component.scss'
})
export class MandateComponent implements OnInit {
  protected encodedShareUrl: string = '';
  protected encodedPrefilledText: string = '';
  protected mandate: Mandate;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.mandate = this.route.snapshot.data.mandate;
  }

  // @todo-regular-giving: calculate the total in matchbot and show on template
  // totalPaid: number = 0;
}
