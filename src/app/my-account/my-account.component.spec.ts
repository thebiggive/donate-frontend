import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MyAccountComponent} from "./my-account.component";
import {HttpClientModule} from "@angular/common/http";
import {IdentityService, TBG_DONATE_ID_STORAGE} from '../identity.service';
import {InMemoryStorageService} from "ngx-webstorage-service";
import {TBG_DONATE_STORAGE} from "../donation.service";
import {of} from "rxjs";
import {Component, NO_ERRORS_SCHEMA} from "@angular/core";

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let element: HTMLElement;
  let main: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyAccountComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientModule,
      ],
      providers: [
        InMemoryStorageService,
        { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const mockIdentityService = TestBed.inject(IdentityService);
    spyOn(mockIdentityService, 'getLoggedInPerson').and.returnValue(of({
      first_name: 'Generous',
      last_name: "Donor",
      email_address: "donor@example.com"
    }));

    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;

    // I would like to select a more specific element like h2 instead of *, but that isn't working for me.
    element = fixture.nativeElement.querySelector('*');

    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should show donor name and email', () => {
    expect(element.textContent).toContain("Generous Donor")
    expect(element.textContent).toContain("Email: donor@example.com")
  });
});
