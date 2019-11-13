import { Component, Input, OnInit } from '@angular/core';

export interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Input() public title: string;
  @Input() public description: string;

  constructor() { }

  category: Category[] = [
    {value: 'category-1', viewValue: 'Category 1'},
    {value: 'category-2', viewValue: 'Category 2'},
    {value: 'category-3', viewValue: 'Category 3'},
  ];

  ngOnInit() {
  }

}
