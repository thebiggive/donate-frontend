import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { PasswordInputComponent } from './password-input.component';

@Component({
  imports: [PasswordInputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="testForm">
      <app-password-input formControlName="password" [inputId]="'test-password'" [label]="'My Password *'" />
    </form>
  `,
})
class TestHostComponent {
  testForm = new FormGroup({
    password: new FormControl('initial-pass'),
  });
}

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputComponent, TestHostComponent, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component['showPassword']()).toBeFalse();
    component.toggleShowPassword();
    expect(component['showPassword']()).toBeTrue();
    component.toggleShowPassword();
    expect(component['showPassword']()).toBeFalse();
  });

  it('should hide password on hidePassword call', () => {
    component.toggleShowPassword();
    expect(component['showPassword']()).toBeTrue();
    component.hidePassword();
    expect(component['showPassword']()).toBeFalse();
  });

  it('should work inside a reactive form with formControlName', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    const hostComponent = hostFixture.componentInstance;

    const inputElement: HTMLInputElement = hostFixture.nativeElement.querySelector('input');
    expect(inputElement.value).toBe('initial-pass');

    inputElement.value = 'updated-pass';
    inputElement.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(hostComponent.testForm.controls.password.value).toBe('updated-pass');
  });

  it('should pass backgroundColour to biggive-text-input', () => {
    component.backgroundColour = 'white';
    fixture.detectChanges();
    const biggiveTextInput: HTMLElement = fixture.nativeElement.querySelector('biggive-text-input');
    expect(biggiveTextInput).toBeTruthy();
  });
});
