import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { DonationStartLoginComponent } from './donation-start-login.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DonationStartLoginComponent', () => {
  let component: DonationStartLoginComponent;
  let fixture: ComponentFixture<DonationStartLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DonationStartLoginComponent],
      imports: [MatDialogModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationStartLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
