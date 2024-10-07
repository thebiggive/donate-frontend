import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Campaign} from "../campaign.model";
import {ComponentsModule} from "@biggive/components-angular";
import {CampaignInfoComponent} from "../campaign-info/campaign-info.component";
import {ImageService} from "../image.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-regular-giving',
  standalone: true,
  imports: [
    ComponentsModule,
    CampaignInfoComponent,
    AsyncPipe
  ],
  templateUrl: './regular-giving.component.html',
  styleUrl: './regular-giving.component.scss'
})
export class RegularGivingComponent implements OnInit{
  protected campaign: Campaign;
  protected bannerUri$: Observable<string|null>;
  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
  ) {
  }
  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.bannerUri$ = this.imageService.getImageUri(this.campaign.bannerUri, 830);
  }
}
