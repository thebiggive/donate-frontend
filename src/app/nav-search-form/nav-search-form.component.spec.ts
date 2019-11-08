import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSearchFormComponent } from './nav-search-form.component';

describe('NavSearchFormComponent', () => {
  let component: NavSearchFormComponent;
  let fixture: ComponentFixture<NavSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
