import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulticurrencyLandingComponent } from './multicurrency-landing.component';

describe('MulticurrencyLandingComponent', () => {
  let component: MulticurrencyLandingComponent;
  let fixture: ComponentFixture<MulticurrencyLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulticurrencyLandingComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticurrencyLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
