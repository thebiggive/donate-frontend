import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignCardFilterGridComponent } from './campaign-card-filter-grid.component';

describe('CampaignCardFilterGridComponent', () => {
  let component: CampaignCardFilterGridComponent;
  let fixture: ComponentFixture<CampaignCardFilterGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignCardFilterGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignCardFilterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display map when UK filter is selected', async () => {
    component.selectedFilterLocation = 'United Kingdom';
    component.categoryOptions = [];
    component.beneficiaryOptions = [];
    component.locationOptions = ['United Kingdom'];
    component.offerNearMeOption = false;
    component.selectedSortByOption = null;
    component.fetchingLocation = false;
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(component.ukFilterSelected()).toBeTrue();
    expect(component.mapElement).toBeDefined();
    expect(component.mapElement?.nativeElement.classList.contains('leaflet-container')).toBeTrue();
  });
});
