import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import {DonationStartContainerComponent} from "./donation-start-container.component";

describe('DonationStartLoginComponent', () => {
  let component: DonationStartContainerComponent;
  let fixture: ComponentFixture<DonationStartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationStartContainerComponent ],
      imports: [MatDialogModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationStartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
