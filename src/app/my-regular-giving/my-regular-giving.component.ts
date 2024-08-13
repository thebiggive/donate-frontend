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
