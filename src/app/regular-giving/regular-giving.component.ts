import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Campaign} from "../campaign.model";
import {ComponentsModule} from "@biggive/components-angular";

@Component({
  selector: 'app-regular-giving',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './regular-giving.component.html',
  styleUrl: './regular-giving.component.css'
})
export class RegularGivingComponent implements OnInit{
  protected campaign: Campaign;
  constructor(
    private route: ActivatedRoute,
  ) {
  }
  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
  }
}
