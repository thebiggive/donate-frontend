import { AsyncPipe } from "@angular/common";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { of } from "rxjs";

import { ExploreComponent } from "./explore.component";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("ExploreComponent", () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [],
      imports: [
        AsyncPipe,
        InfiniteScrollDirective,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: "search",
            component: ExploreComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
            queryParams: of({}), // Let `loadQueryParamsAndRun()` subscribe without crashing.
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
