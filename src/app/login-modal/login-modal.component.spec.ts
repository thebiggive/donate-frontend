import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { LoginModalComponent } from './login-modal.component';
import { TBG_DONATE_ID_STORAGE } from '../identity.service';
import {NgxMatomoModule} from "ngx-matomo-client";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [],
    imports: [FormsModule,
        MatButtonModule,
        MatDialogModule,
        NgxMatomoModule.forRoot({
            siteId: '',
            trackerUrl: '',
        }),
        NoopAnimationsModule,
        ReactiveFormsModule],
    providers: [
        { provide: ActivatedRoute, useValue: {} }, // Needed for ngx-matomo not to crash.
        InMemoryStorageService,
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
