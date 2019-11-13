import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Input() public title: string;
  @Input() public description: string;
  @Output() heroSearch: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  search(term: string) {
    this.heroSearch.emit(term);
  }
}
