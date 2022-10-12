import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCreditsComponent } from './buy-credits.component';

describe('BuyCreditsComponent', () => {
  let component: BuyCreditsComponent;
  let fixture: ComponentFixture<BuyCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyCreditsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
