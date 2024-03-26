import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatomoModule } from 'ngx-matomo';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { TBG_DONATE_ID_STORAGE } from '../identity.service';
import { ResetPasswordComponent } from './reset-password.component';
import {NgxMatomoModule} from "ngx-matomo-client";



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
        MatomoModule.forRoot({
          scriptUrl: `https://example.com/matomo.js`,
          trackers: [],
          routeTracking: {
            enable: true,
          }
        }),
        NgxMatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
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
