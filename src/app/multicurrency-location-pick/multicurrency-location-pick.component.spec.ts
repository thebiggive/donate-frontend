import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { MulticurrencyLocationPickComponent } from './multicurrency-location-pick.component';

describe('MulticurrencyLocationPickComponent', () => {
  let component: MulticurrencyLocationPickComponent;
  let fixture: ComponentFixture<MulticurrencyLocationPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulticurrencyLocationPickComponent ],
      imports: [
        BrowserTransferStateModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService},
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticurrencyLocationPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
