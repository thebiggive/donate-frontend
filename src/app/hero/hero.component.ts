import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Input() public title: string;
  @Input() public description: string;

  constructor() { }

  ngOnInit() {
  }

  onGlobalSearch() {
    // TODO hook this up with the MetaCampaign search & its filters
    console.log('Search placeholder event!');
  }
}
