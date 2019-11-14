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

  public webp: boolean; // Dynamically use the smallest supported image format

  constructor() { }

  ngOnInit() {
    Modernizr.on('webp', browserSupportsWebp => this.webp = browserSupportsWebp);
  }

  search(term: string) {
    this.heroSearch.emit(term);
  }
}
