import { Component, OnInit, inject } from '@angular/core';
import { PageMetaService } from '../../page-meta.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  BiggiveButton,
  BiggiveContainerCard,
  BiggiveGrid,
  BiggiveHeading,
  BiggivePageSection,
} from '@biggive/components-angular';

import { Mandate } from '../../mandate.model';
import { MoneyPipe } from '../../money.pipe';

@Component({
  selector: 'app-my-mandates',
  imports: [BiggiveButton, BiggiveContainerCard, BiggiveGrid, BiggiveHeading, BiggivePageSection, DatePipe, MoneyPipe],
  templateUrl: './my-regular-giving.component.html',
  styleUrl: './my-regular-giving.component.scss',
})
export class MyRegularGivingComponent implements OnInit {
  private pageMeta = inject(PageMetaService);
  private route = inject(ActivatedRoute);

  protected mandates!: Mandate[];

  ngOnInit() {
    this.pageMeta.setCommon('Your Regular Giving Mandates', 'Donations you make to support charities each month', null);

    this.mandates = this.route.snapshot.data.mandates;
  }
}
