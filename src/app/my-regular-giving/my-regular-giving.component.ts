import {Component,  OnInit} from '@angular/core';
import {PageMetaService} from "../page-meta.service";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe, DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {allChildComponentImports} from "../../allChildComponentImports";
import {Mandate} from "../mandate.model";

@Component({
  selector: 'app-my-mandates',
  standalone: true,
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    ExactCurrencyPipe,
    DatePipe,
    MatProgressSpinner
  ],
  templateUrl: './my-regular-giving.component.html',
  styleUrl: './my-regular-giving.component.scss'
})
export class MyRegularGivingComponent implements OnInit{
  protected mandates: Mandate[];

  /** @convert number to ordinal, e.g 1st, 2nd*/
  protected ordinal = (d: number) => {
    if (d > 3 && d < 21) return d + 'th';
    switch (d % 10) {
      case 1:  return d + "st";
      case 2:  return d + "nd";
      case 3:  return d + "rd";
      default: return d + "th";
    }
  };

  constructor(
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give - Your Regular Giving Mandates', '', null
    );

    this.mandates = this.route.snapshot.data.mandates;
  }
}
