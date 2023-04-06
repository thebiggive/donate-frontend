import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationStartLoginComponent } from './donation-start-login.component';

describe('DonationStartLoginComponent', () => {
  let component: DonationStartLoginComponent;
  let fixture: ComponentFixture<DonationStartLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationStartLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationStartLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
