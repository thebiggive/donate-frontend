import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCardModalComponent } from './update-card-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UpdateCardModalComponent', () => {
  let component: UpdateCardModalComponent;
  let fixture: ComponentFixture<UpdateCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [],
      imports: [FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule],
      providers: [InMemoryStorageService, { provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
