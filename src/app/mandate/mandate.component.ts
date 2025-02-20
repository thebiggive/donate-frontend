import {Component, OnInit} from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {DatePipe} from "@angular/common";
import {Mandate} from "../mandate.model";
import {ActivatedRoute} from "@angular/router";
import {MoneyPipe} from "../money.pipe";
import {myRegularGivingPath} from '../app-routing';


@Component({
    selector: 'app-mandate',
    imports: [
        ComponentsModule,
        DatePipe,
        MoneyPipe
    ],
    templateUrl: './mandate.component.html',
    styleUrl: './mandate.component.scss'
})
export class MandateComponent {
  protected encodedShareUrl: string = '';
  protected encodedPrefilledText: string = '';
  protected mandate!: Mandate;
  protected readonly cancelPath;


  constructor(
    private route: ActivatedRoute
  ) {
    this.mandate = this.route.snapshot.data.mandate;
    this.cancelPath = `/${myRegularGivingPath}/${this.mandate.id}/cancel`;
  }
}
