import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CharityComponent } from './charity.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('CharityComponent', () => {
  let component: CharityComponent;
  let fixture: ComponentFixture<CharityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { campaigns: [] }} } },
        DatePipe,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
