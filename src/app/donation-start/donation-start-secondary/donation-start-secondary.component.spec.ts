import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationStartSecondaryComponent } from './donation-start-secondary.component';

describe('DonationStartSecondaryComponent', () => {
  let component: DonationStartSecondaryComponent;
  let fixture: ComponentFixture<DonationStartSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationStartSecondaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationStartSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
