import {Component, OnInit} from '@angular/core';

import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "./HighlightCard";
import {environment} from "../../environments/environment";
import {CampaignService} from "../campaign.service";
import {cardsForMetaCampaigns} from "./cardsForMetaCampaigns";
import { CampaignStats } from '../campaign-stats.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';
  campaignImpactStats$: Observable<CampaignStats> = this.campaignService.getCampaignImpactStats();
  highlightCards: readonly HighlightCard[];
  loading: boolean = true;

  public constructor(
    private pageMeta: PageMetaService,
    private campaignService: CampaignService,
  ) {}

  ngOnInit() {
    this.campaignService.fetchAllMetaCampaigns().subscribe(metaCampaigns => {
        this.highlightCards = cardsForMetaCampaigns(new Date(), metaCampaigns, environment.donateGlobalUriPrefix, environment.blogUriPrefix);
        this.loading = false;
      }, () => {
        this.loading = false;
      },
    );

    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
  }
}
