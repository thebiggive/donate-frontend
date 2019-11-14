import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatSelectModule,
} from '@angular/material';

import { CardSectionComponent } from './card-section.component';
import { FiltersComponent } from '../filters/filters.component';

describe('CardSectionComponent', () => {
  let component: CardSectionComponent;
  let fixture: ComponentFixture<CardSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardSectionComponent,
        FiltersComponent,
      ],
      imports: [
        MatSelectModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
