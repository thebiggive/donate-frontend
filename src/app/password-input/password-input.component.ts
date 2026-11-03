import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { BiggiveButton, BiggiveTextInput } from '@biggive/components-angular';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-password-input',
  imports: [BiggiveButton, BiggiveTextInput, MatInput, ReactiveFormsModule, FormsModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor, OnInit {
  private cdr = inject(ChangeDetectorRef);
  private formGroupDirective = inject(FormGroupDirective, { optional: true });
  private ngForm = inject(NgForm, { optional: true });

  @Input({ required: true }) id!: string;
  @Input() label: string = 'Password *';
  @Input() spaceBelow: number | string = 4;
  @Input() autocomplete?: string;
  @Input() backgroundColour: 'white' | 'grey' = 'grey';

  protected readonly showPassword = signal(false);
  protected value = '';
  protected disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.formGroupDirective?.ngSubmit?.subscribe(() => {
      this.hidePassword();
    });
    this.ngForm?.ngSubmit?.subscribe(() => {
      this.hidePassword();
    });
  }

  @HostListener('document:submit')
  onDocumentSubmit(): void {
    this.hidePassword();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  toggleShowPassword(): void {
    this.showPassword.update((current) => !current);
  }

  hidePassword(): void {
    if (this.showPassword()) {
      this.showPassword.set(false);
      this.cdr.markForCheck();
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
