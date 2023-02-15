import { Component,  OnInit } from '@angular/core';
import { PageMetaService } from '../page-meta.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  providers: [DatePipe]
})
export class MyAccountComponent implements OnInit {

  constructor(
    private pageMeta: PageMetaService,
  ) {
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give - My account',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
  }
}
