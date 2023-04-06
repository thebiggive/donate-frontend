import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationStartFormComponent } from './donation-start-form.component';

describe('DonationStartFormComponent', () => {
  let component: DonationStartFormComponent;
  let fixture: ComponentFixture<DonationStartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationStartFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationStartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
