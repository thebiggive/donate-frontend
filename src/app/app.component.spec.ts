import {APP_BASE_HREF, AsyncPipe} from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import {NgxMatomoModule, provideMatomo, withRouter} from 'ngx-matomo-client';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { AppComponent } from './app.component';
import { TBG_DONATE_STORAGE } from './donation.service';
import { TBG_DONATE_ID_STORAGE } from './identity.service'

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        AsyncPipe,
        HttpClientTestingModule,
        MatButtonModule, // Not required but makes test DOM layout more realistic
        MatIconModule,
        MatInputModule,
        MatListModule,
        NgxMatomoModule.forRoot({
          scriptUrl: `https://example.com/matomo.js`,
          trackers: [{siteId: '', trackerUrl: ''}],
        }),
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: 'http://some.test.localhost' },
        InMemoryStorageService,
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
        provideMatomo({ trackerUrl: '', siteId: ''}, withRouter()),
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
