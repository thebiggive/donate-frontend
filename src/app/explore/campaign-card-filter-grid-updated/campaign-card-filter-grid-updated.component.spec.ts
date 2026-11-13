import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignCardFilterGridUpdatedComponent } from './campaign-card-filter-grid-updated.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatomoModule, MatomoTracker } from 'ngx-matomo-client';
import { MatomoTestingModule } from 'ngx-matomo-client/testing';
import { of } from 'rxjs';

describe('CampaignCardFilterGridComponent', () => {
  let component: CampaignCardFilterGridUpdatedComponent;
  let fixture: ComponentFixture<CampaignCardFilterGridUpdatedComponent>;
  let httpClient: HttpClient;
  let matomoTracker: MatomoTracker;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignCardFilterGridUpdatedComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatomoModule, useClass: MatomoTestingModule },
      ],
    }).compileComponents();

    httpClient = TestBed.inject(HttpClient);
    matomoTracker = TestBed.inject(MatomoTracker);
    spyOn(httpClient, 'get').and.returnValue(of({ type: 'FeatureCollection', features: [] }));

    fixture = TestBed.createComponent(CampaignCardFilterGridUpdatedComponent);
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

  it('should retain the same TileLayer instance across re-renders to avoid tile flashing', async () => {
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

    const initialTileLayer = (component as unknown as { tileLayer?: unknown }).tileLayer;
    expect(initialTileLayer).toBeDefined();

    component.ngOnChanges({});
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 50));

    const updatedTileLayer = (component as unknown as { tileLayer?: unknown }).tileLayer;
    expect(updatedTileLayer).toBe(initialTileLayer);
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
    fixture.componentRef.setInput('searchResult', { UKFilterRegions: ['E12000001'] } as unknown);
    fixture.detectChanges();

    // Immediately clear searchResult to simulate "Back to UK"
    fixture.componentRef.setInput('searchResult', undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    await Promise.resolve();

    // Map bounds should reflect UK bounds without throwing or reverting to region bounds
    expect(component.mapElement?.nativeElement.classList.contains('leaflet-container')).toBeTrue();
  });

  it('should include location in sortOptions and resolve selected value when location is set', () => {
    component.location = {
      coords: { latitude: 51.5, longitude: -0.1 },
    } as GeolocationPosition;
    component.selectedSortByOption = 'Closest';
    fixture.detectChanges();

    const options = (component as unknown as { sortOptions: () => { value: string; label: string }[] }).sortOptions();
    expect(
      options.some((opt: { value: string; label: string }) => opt.value === 'location' && opt.label === 'Closest'),
    ).toBeTrue();
    expect(component.getSelectedValue()).toBe('location');
  });

  it('should include location in sortOptions when selectedSortByOption is Closest even before location object is passed', () => {
    component.selectedSortByOption = 'Closest';
    fixture.detectChanges();

    const options = (component as unknown as { sortOptions: () => { value: string; label: string }[] }).sortOptions();
    expect(options.some((opt: { value: string; label: string }) => opt.value === 'location')).toBeTrue();
    expect(component.getSelectedValue()).toBe('location');
  });

  it('should emit doSearchAndFilterUpdate with null filterTheme when removeFilter is called for themes', () => {
    const trackEventSpy = spyOn(matomoTracker, 'trackEvent');
    component.selectedFilterTheme = 'Religious';
    let emittedValue: { filterTheme?: string | null } | undefined;
    component.doSearchAndFilterUpdate.subscribe((val) => {
      emittedValue = val;
    });

    (component as unknown as { removeFilter: (key: string) => void }).removeFilter('themes');

    expect(component.selectedFilterTheme).toBeNull();
    expect(emittedValue?.filterTheme).toBeNull();
    expect(trackEventSpy).toHaveBeenCalledWith('search', 'remove_filter_clicked', 'themes');
  });

  it('should track search button clicks and sort selection changes', () => {
    const trackEventSpy = spyOn(matomoTracker, 'trackEvent');
    component.searchText = 'cats';

    (component as unknown as { handleSearchButtonPressed: () => void }).handleSearchButtonPressed();
    expect(trackEventSpy).toHaveBeenCalledWith('search', 'search_button_clicked', 'cats');

    (component as unknown as { sortBySelectionChanged: (val: string) => void }).sortBySelectionChanged('Closest');
    expect(trackEventSpy).toHaveBeenCalledWith('search', 'sort_option_changed', 'Closest');
  });

  it('should show spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should compute themeOptions sorted alphabetically with match count in brackets from searchResult themes', () => {
    fixture.componentRef.setInput('searchResult', {
      themes: [
        { theme: 'Health', numCampaigns: 15 },
        { theme: 'Education', numCampaigns: 3 },
        { theme: 'Animals', numCampaigns: 7 },
      ],
    } as unknown);
    fixture.detectChanges();

    const options = (component as unknown as { themeOptions: () => { value: string; label: string }[] }).themeOptions();
    expect(options).toEqual([
      { value: 'Animals', label: 'Animals [7]' },
      { value: 'Education', label: 'Education [3]' },
      { value: 'Health', label: 'Health [15]' },
    ]);
  });

  it('should return empty array for themeOptions when searchResult has no themes', () => {
    fixture.componentRef.setInput('searchResult', undefined);
    fixture.detectChanges();

    const options = (component as unknown as { themeOptions: () => { value: string; label: string }[] }).themeOptions();
    expect(options).toEqual([]);
  });

  it('should compute countryOptions sorted alphabetically with match count in brackets from searchResult countries', () => {
    fixture.componentRef.setInput('searchResult', {
      countries: [
        { country: 'United Kingdom', numCampaigns: 50 },
        { country: 'Australia', numCampaigns: 4 },
        { country: 'Ghana', numCampaigns: 12 },
      ],
    } as unknown);
    fixture.detectChanges();

    const options = (
      component as unknown as { countryOptions: () => { value: string; label: string }[] }
    ).countryOptions();
    expect(options).toEqual([
      { value: 'Australia', label: 'Australia [4]' },
      { value: 'Ghana', label: 'Ghana [12]' },
      { value: 'United Kingdom', label: 'United Kingdom [50]' },
    ]);
  });

  it('should return empty array for countryOptions when searchResult has no countries', () => {
    fixture.componentRef.setInput('searchResult', undefined);
    fixture.detectChanges();

    const options = (
      component as unknown as { countryOptions: () => { value: string; label: string }[] }
    ).countryOptions();
    expect(options).toEqual([]);
  });
});
