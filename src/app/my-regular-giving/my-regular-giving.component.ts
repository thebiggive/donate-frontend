import {Component,  OnInit} from '@angular/core';
import {PageMetaService} from "../page-meta.service";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {allChildComponentImports} from "../../allChildComponentImports";
import {Mandate} from "../mandate.model";
import {MoneyPipe} from "../money.pipe";

@Component({
    selector: 'app-my-mandates',
    imports: [
        ...allChildComponentImports,
        DatePipe,
        MoneyPipe
    ],
    templateUrl: './my-regular-giving.component.html',
    styleUrl: './my-regular-giving.component.scss'
})
export class MyRegularGivingComponent implements OnInit{
  protected mandates!: Mandate[];

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
      'Your Regular Giving Mandates', 'Donations you make to support charities each month', null
    );

    this.mandates = this.route.snapshot.data.mandates;
  }
}
