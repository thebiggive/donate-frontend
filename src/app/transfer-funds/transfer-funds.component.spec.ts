import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {MatomoModule} from "ngx-matomo-client";
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { TBG_DONATE_ID_STORAGE } from '../identity.service';
import { TransferFundsComponent } from './transfer-funds.component';

describe('TransferFundsComponent', () => {
  let component: TransferFundsComponent;
  let fixture: ComponentFixture<TransferFundsComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatStepperModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: 'transfer-funds',
            component: TransferFundsComponent,
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
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(TransferFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
