import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStandaloneComponent } from './popup-standalone.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PopupStandaloneComponent', () => {
  let component: PopupStandaloneComponent;
  let fixture: ComponentFixture<PopupStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [PopupStandaloneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
