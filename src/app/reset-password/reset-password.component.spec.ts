import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { TBG_DONATE_STORAGE } from '../donation.service';
import { TBG_DONATE_ID_STORAGE } from '../identity.service';

import { ResetPasswordComponent } from './reset-password.component';


describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'reset-password',
            component: ResetPasswordComponent,
          },
        ]),
      ],
      providers: [
        InMemoryStorageService,
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
