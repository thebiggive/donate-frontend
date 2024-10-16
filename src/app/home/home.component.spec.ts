import { AsyncPipe } from "@angular/common";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { HomeComponent } from "./home.component";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [HomeComponent],
      imports: [
        AsyncPipe,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
              data: { campaigns: [], highlights: [] },
            },
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
