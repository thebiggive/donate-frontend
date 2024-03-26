import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatomoModule } from 'ngx-matomo';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { RegisterModalComponent } from './register-modal.component';
import { TBG_DONATE_ID_STORAGE } from '../identity.service';
import { ActivatedRoute } from '@angular/router';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatomoModule.forRoot({
          scriptUrl: `https://example.com/matomo.js`,
          trackers: [],
          routeTracking: {
            enable: true,
          }
        }),
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} }, // Needed for ngx-matomo not to crash.
        InMemoryStorageService,
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: MatDialogRef, useValue: {} },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
