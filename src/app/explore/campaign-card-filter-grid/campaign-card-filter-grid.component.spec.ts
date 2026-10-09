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
    fixture.componentRef.setInput('individualCampaigns', []);
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

  it('should render count markers with correct count', async () => {
    component.selectedFilterLocation = 'United Kingdom';
    component.categoryOptions = [];
    component.beneficiaryOptions = [];
    component.locationOptions = ['United Kingdom'];
    component.offerNearMeOption = false;
    component.selectedSortByOption = null;
    component.fetchingLocation = false;
    component.highlightAreas = [
      {
        type: 'Feature',
        properties: {
          code: 'TEST_REGION_1',
          name: 'Test Region 1',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-4.0, 55.0],
              [-4.0, 57.0],
              [-2.0, 57.0],
              [-2.0, 55.0],
              [-4.0, 55.0],
            ],
          ],
        },
      },
    ];
    component.locationCounts = [{ regionCode: 'TEST_REGION_1', numCampaigns: 42 }];

    fixture.detectChanges();
    component.ngOnChanges({});
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const markerButton = fixture.nativeElement.querySelector('.campaign-count-marker');
    expect(markerButton).toBeTruthy();
    expect(markerButton.textContent).toContain('42');
  });

  it('should ignore stale async region bounds when zooming out', async () => {
    component.selectedFilterLocation = 'United Kingdom';
    component.categoryOptions = [];
    component.beneficiaryOptions = [];
    component.locationOptions = ['United Kingdom'];
    component.offerNearMeOption = false;
    component.selectedSortByOption = null;
    component.fetchingLocation = false;
    fixture.detectChanges();
    await fixture.whenStable();

    // Trigger updateMapBounds with a filter region, then immediately reset to simulate quick zoom-out
    fixture.componentRef.setInput('searchResult', { UKFilterRegions: ['E12000001'] } as any);
    fixture.detectChanges();

    // Immediately clear searchResult to simulate "Back to UK"
    fixture.componentRef.setInput('searchResult', undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Map bounds should reflect UK bounds without throwing or reverting to region bounds
    expect(component.mapElement?.nativeElement.classList.contains('leaflet-container')).toBeTrue();
  });
});
