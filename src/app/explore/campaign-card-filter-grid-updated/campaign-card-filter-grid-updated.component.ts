import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  input,
  OnChanges,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SearchService } from '../../search.service';
import { flags } from '../../featureFlags';
import { BiggiveButton, BiggiveFormFieldSelect, BiggivePopup } from '@biggive/components-angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCircleChevronDown,
  faCircleChevronUp,
  faFilter,
  faLocationCrosshairs,
  faMagnifyingGlass,
  faTableList,
} from '@fortawesome/free-solid-svg-icons';
import { faExpandArrows } from '@fortawesome/pro-solid-svg-icons';
import { DivIcon, GeoJSON, Map, Marker, TileLayer } from 'leaflet';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { getPoleOfInaccessibility } from '../../polylabel';
import { CampaignSummaryGridComponent } from '../campaign-summary-grid/campaign-summary-grid.component';
import { CampaignSummary, CampaignSummaryList, UKRegion } from '../../campaign-summary.model';
import { getHighlightedFeatures } from '../../regions';
import { HttpClient } from '@angular/common/http';
import { MatomoTracker } from 'ngx-matomo-client';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const sortOptionLabels = {
  relevance: 'Most relevant',
  location: 'Closest',
  amountRaised: 'Most raised',
  leastRaised: 'Least raised',
  closeToTarget: 'Nearest target',
  matchFundsRemaining: 'Most funds remaining',
} as const;

export type sortOptionKey = keyof typeof sortOptionLabels;
export type sortOptionLabel = (typeof sortOptionLabels)[sortOptionKey];

@Component({
  selector: 'app-campaign-card-filter-grid-updated',
  imports: [
    BiggiveButton,
    BiggivePopup,
    BiggiveFormFieldSelect,
    FaIconComponent,
    CampaignSummaryGridComponent,
    MatProgressSpinner,
  ],
  templateUrl: './campaign-card-filter-grid-updated.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './campaign-card-filter-grid-updated.component.scss',
})
export class CampaignCardFilterGridUpdatedComponent implements OnDestroy, OnChanges, AfterViewInit {
  private matomoTracker = inject(MatomoTracker);
  private platformId = inject(PLATFORM_ID);
  protected hasGeoLocation = signal(false);
  protected ukRegionFilterSelected = signal(false);
  protected currentSortByOption = signal<sortOptionLabel | null>(null);
  protected readonly campaignDrawerOpen = signal(false);

  protected locationSortAvailable = computed(() => {
    return (
      this.ukFilterSelected() ||
      this.hasGeoLocation() ||
      this.ukRegionFilterSelected() ||
      this.currentSortByOption() === sortOptionLabels.location ||
      this.searchService.hasGeoLocationSet()
    );
  });

  protected sortOptions = computed(() => {
    // @ts-expect-error  - see https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    const sortOptionKeys: sortOptionKey[] = Object.getOwnPropertyNames(sortOptionLabels);
    const relevantOptionKeys = sortOptionKeys
      .filter((key) => key !== 'relevance' || this.hasSearchTerm())
      .filter((key) => key !== 'location' || this.locationSortAvailable());

    return relevantOptionKeys.map((key: sortOptionKey) => ({ value: key, label: sortOptionLabels[key] }));
  });
  protected hasSearchTerm = signal(false);

  /**
   * JSON array of category key/values
   */
  @Input({ required: true }) categoryOptions!: string[];

  /**
   * JSON array of beneficiary key/values
   */
  @Input({ required: true }) beneficiaryOptions!: string[];

  protected themeOptions = computed(() => {
    return [...(this.searchResult()?.themes || [])]
      .sort((a, b) => a.theme.localeCompare(b.theme))
      .map((theme) => ({
        value: theme.theme,
        label: `${theme.theme} [${theme.numCampaigns}]`,
      }));
  });

  protected countryOptions = computed(() => {
    return [...(this.searchResult()?.countries || [])]
      .sort((a, b) => a.country.localeCompare(b.country))
      .map((country) => ({
        value: country.country,
        label: `${country.country} [${country.numCampaigns}]`,
      }));
  });

  /**
   * JSON array of location key/values
   */
  @Input({ required: true }) locationOptions!: string[];
  protected searchService = inject(SearchService);
  protected flags = flags;
  protected readonly enableMapFullScreenMobileMode = flags.enableMapFullScreenMobileMode;

  /**
   * Selected location around which donor is looking for campaigns
   */
  @Input({ required: true }) set location(value: GeolocationPosition | undefined) {
    this._location = value;
    this.hasGeoLocation.set(!!value || !!this._geoLocation || this.searchService.hasGeoLocationSet());
  }
  get location(): GeolocationPosition | undefined {
    return this._location;
  }
  private _location: GeolocationPosition | undefined;

  /**
   * Indicates that the component is currently fetching the browser location
   */
  @Input({ required: true }) fetchingLocation!: boolean;

  @Input() set geoLocation(value: GeolocationPosition | undefined) {
    this._geoLocation = value;
    this.hasGeoLocation.set(!!value || !!this._location || this.searchService.hasGeoLocationSet());
  }
  get geoLocation(): GeolocationPosition | undefined {
    return this._geoLocation;
  }
  private _geoLocation: GeolocationPosition | undefined;

  @Input() highlightAreas: Array<Feature<Geometry, GeoJsonProperties>> | undefined;

  /** deprecated - remove and use searchResult instead */
  @Input() locationCounts?: { regionCode: string; numCampaigns: number }[];

  public searchResult = input<CampaignSummaryList | undefined>();

  protected themesPlaceHolderText = 'Select theme';
  protected locationsPlaceHolderText = 'Select location';
  private initialSortByOption: sortOptionLabel;

  /**
   * This and similar properties represent selections made in the popup but not yet applied.
   */
  private newSelectedFilterTheme: string | null = null;
  private newSelectedFilterLocation: string | null = null;
  protected fullScreenMapMode = signal(false);
  private httpClient = inject(HttpClient);

  @ViewChild('root') el!: ElementRef;

  doSearchAndFilterUpdate = output<{
    searchText: string | null;
    sortBy: string | null;
    filterTheme: string | null;
    filterLocation: string | null;
    filterUKRegion?: string | null;
  }>();

  doGetGeoLocationFromBrowser = output<void>();
  doClearGeoLocation = output<void>();
  protected faCircleChevronDown = faCircleChevronDown;
  protected faCircleChevronUp = faCircleChevronUp;
  protected faExpandArrows = faExpandArrows;
  protected faFilter = faFilter;
  protected faLocationCrosshairs = faLocationCrosshairs;
  protected faMagnifyingGlass = faMagnifyingGlass;
  protected faTableList = faTableList;

  /** If we've selected closest for a donor during the life of this component and they chose something else
   * then we let them continue to make their own sort order choice and not force the 'closest' sort on them
   * every time they navigate the map.
   */
  protected closestSearchRejected = false;

  /**
   * Space below component
   */
  spaceBelow: number = 0;

  /**
   * Optional search text prop. Useful for pre-populating the search field
   * when the page is loaded with a search term already existing in the URL.
   * This can happen when sharing links, or if a donor goes to a campaign page
   * after searching, and then returns to the search results. In such a case,
   * the search box text will clear, unless we use this to it on
   * rendering. DON-652.
   */
  @Input({ required: true }) searchText: string | null = null;

  /**
   * This helps us inject a pre-selected dropdown value from outside of this component.
   * This is especially helpful for the Meta campaign and Explore pages, where searching
   * by text wipes out previous sort options and re-uses Relevance, or where one of those
   * two pages is loaded directly with URL parameters - in such a scenario the dropdown
   * shows that it's pre-selected. DON-558.
   */
  @Input({ required: true }) set selectedSortByOption(value: sortOptionLabel | null) {
    this._selectedSortByOption = value;
    this.currentSortByOption.set(value);
  }
  get selectedSortByOption(): sortOptionLabel | null {
    return this._selectedSortByOption;
  }
  private _selectedSortByOption: sortOptionLabel | null = null;

  /**
   * For injecting the chosen category or beneficiary to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Input({ required: true }) selectedFilterTheme: string | null = null;

  /**
   * ONS code for a region of the UK that the user has selected to search within,
   * using, e.g. `E12000001` for North East England or `E09000014` for Haringey. In the latter
   * case results may also include campaigns with impact on Greater London as a whole.
   */
  @Input({ required: true }) set selectedFilterUKRegion(value: string | null) {
    this._selectedFilterUKRegion = value;
    this.ukRegionFilterSelected.set(!!value);
  }
  get selectedFilterUKRegion(): string | null {
    return this._selectedFilterUKRegion;
  }
  private _selectedFilterUKRegion: string | null = null;

  scrolled = output<void>();

  async emitOnScroll() {
    this.scrolled.emit();
  }

  individualCampaigns = input.required<CampaignSummary[]>();
  loading = input<boolean>(false);

  /**
   * For injecting the chosen location to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Input({ required: true }) set selectedFilterLocation(value: string | null) {
    this._selectedFilterLocation = value;
    this.ukFilterSelected.set(this.locationFilterIsUK(value));
  }
  get selectedFilterLocation(): string | null {
    return this._selectedFilterLocation;
  }
  private _selectedFilterLocation: string | null = null;

  ukFilterSelected = signal(false);

  // Implemented as in campaign-info componenent.
  // Typescript has trouble distinguishing JS built-in Map vs Leaflet's Map since we are using a loose typings file for leaflet v2.
  // We explicitly use 'any' here since the actual typings for Leaflet Map aren't strictly available in this declaration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tileLayer?: any;

  /**
   * Sets bounds options which allow a modest space around the relevant area (either whole of UK, one of the major
   * subdivisions of England, or Wales, Scotland or Nothern Ireland), plus an extra
   * space for the controls drawer when in full sceen mode.
   */
  private readonly boundsOptions = computed(() => {
    return {
      paddingTopLeft: [8, 8],
      // Campaign Results bar is approx. 34px including padding. Add that much to 8px in full screen.
      paddingBottomRight: [8, this.fullScreenMapMode() ? 42 : 8],
    };
  });

  private resizeObserver?: ResizeObserver;
  private latestBoundsRequestId = 0;

  /**
   * Allow donors to select campaigns near to themselves.
   */
  enableSearchByLocation = flags.enableSearchByLocation;

  @Input({ required: true }) offerNearMeOption!: boolean;

  protected filtersApplied: boolean;

  @ViewChild('mapElement') set mapElement(element: ElementRef<HTMLDivElement> | undefined) {
    this._mapElement = element;
    if (element && isPlatformBrowser(this.platformId)) {
      this.initMap();
      this.setupMapObserver(element);
    } else {
      this.teardownMap();
    }
  }
  get mapElement(): ElementRef<HTMLDivElement> | undefined {
    return this._mapElement;
  }
  private _mapElement: ElementRef<HTMLDivElement> | undefined;

  protected themeFilterSelectionChanged = (value: string) => {
    this.newSelectedFilterTheme = value;
  };

  protected locationSelectionChanged = (value: string) => {
    this.newSelectedFilterLocation = value;
  };

  protected UKRegionSelectionChanged = (regionCode: string) => {
    this.matomoTracker.trackEvent('search', 'map_region_drop_down_selected', regionCode);
    this.location = undefined;
    this.doClearGeoLocation.emit();
    this.selectedFilterUKRegion = regionCode;
    this.autoSelectSortByClosest();
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  };

  /**
   * Called when the user navigates to a region within the UK so we can select sort by closest if appropriate.
   *
   * Not perfect since it only really makes sense if there are two regions in their search so we can sort things in
   * the more local region first - so if they selected Haringey we sort Haringey then London, but if they just selected
   * London there's nothing to sort by. But afaik at the time this runs we don't have easy access to that info, and
   * this may be good enough.
   */
  private autoSelectSortByClosest(): void {
    if (this.closestSearchRejected) {
      // the user has already signaled that they want to sort by a different criteria.
      return;
    }

    this.selectedSortByOption = 'Closest';
  }

  protected sortBySelectionChanged = (value: sortOptionLabel | string) => {
    this.matomoTracker.trackEvent('search', 'sort_option_changed', String(value));
    if (this.selectedSortByOption === 'Closest') {
      this.closestSearchRejected = true;
    }

    // @ts-expect-error getting Type string is not assignable to type sortOptionLabel | null . Maybe somethigng we can 'grandfather' from before port from stencil.
    this.selectedSortByOption = value;
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  };

  protected getSearchAndFilterObject() {
    return {
      searchText: this.searchText,
      sortBy: this.selectedSortByOption,
      filterTheme: this.selectedFilterTheme,
      filterLocation: this.selectedFilterLocation,
      filterUKRegion: this.selectedFilterUKRegion,
    };
  }

  protected handleApplyFilterButtonClick = () => {
    this.matomoTracker.trackEvent('search', 'filter_popup_applied');
    this.selectedFilterTheme = this.newSelectedFilterTheme ?? this.selectedFilterTheme;
    this.selectedFilterLocation = this.newSelectedFilterLocation ?? this.selectedFilterLocation;

    const searchAndFilterObj = this.getSearchAndFilterObject();
    this.doSearchAndFilterUpdate.emit(searchAndFilterObj);

    const filterPopup = this.el.nativeElement.querySelector('#filter-popup') as HTMLBiggivePopupElement | undefined;
    if (filterPopup) {
      filterPopup.closeFromOutside();
    }

    // hereish
    this.filtersApplied =
      typeof searchAndFilterObj.filterTheme === 'string' || typeof searchAndFilterObj.filterLocation === 'string';

    this.ukFilterSelected.set(this.locationFilterIsUK(this.selectedFilterLocation));
  };

  protected removeFilter(filterKey: 'locations' | 'themes') {
    this.matomoTracker.trackEvent('search', 'remove_filter_clicked', filterKey);
    switch (filterKey) {
      case 'themes':
        this.selectedFilterTheme = null;
        break;
      case 'locations':
        this.selectedFilterLocation = null;
        this.ukFilterSelected.set(this.locationFilterIsUK(this.selectedFilterLocation));
        break;
      default:
        // This asks the compiler to check that we are in dead code, i.e. we covered all the possible filter keys
        // above. If we missed one we would get a compile error trying to assign a string to a never.
        const exhaustiveSwitch: never = filterKey; // eslint-disable-line
        console.error(exhaustiveSwitch);
    }

    const selectEl = this.el.nativeElement.querySelector('#' + filterKey) as
      | HTMLBiggiveFormFieldSelectElement
      | undefined;
    if (selectEl) {
      selectEl.selectedLabel = null;
      selectEl.selectedValue = null;
    }

    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  }

  protected handleSearchButtonPressed = () => {
    this.matomoTracker.trackEvent('search', 'search_button_clicked', this.searchText || '');
    this.unfocusTextInput();
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
    this.hasSearchTerm.set(!!this.searchText && this.searchText.length > 0);

    if (this.hasSearchTerm()) {
      this.selectedSortByOption = 'Most relevant';
    }
  };

  protected handleNearMeButtonPressed = () => {
    this.matomoTracker.trackEvent('search', 'geo_chosen', 'Near me button clicked');
    this.unfocusTextInput();
    this.doGetGeoLocationFromBrowser.emit();
  };

  protected handleSearchTextChanged = (event: Event) => {
    // @ts-expect-error - we know it will be from an input element so will have a value.
    this.searchText = event.target.value;
    this.hasSearchTerm.set(true);
  };

  protected handleEnterPressed = (ev: Event) => {
    const keyboardEvent = ev as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      this.matomoTracker.trackEvent('search', 'search_enter_pressed', this.searchText || '');
      this.unfocusTextInput();
      this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
    }
  };

  protected handleFilterButtonClick = () => {
    this.matomoTracker.trackEvent('search', 'filter_popup_opened');
    this.newSelectedFilterTheme = this.selectedFilterTheme;
    this.newSelectedFilterLocation = this.selectedFilterLocation;

    const filterPopup = this.el.nativeElement.querySelector('#filter-popup') as HTMLBiggivePopupElement | undefined;
    if (filterPopup) {
      filterPopup.openFromOutside();
    }
  };

  protected handleClearAll = () => {
    this.matomoTracker.trackEvent('search', 'clear_filters_clicked');
    this.unfocusTextInput();

    // Set the 'Filters' button back to the primary background colour
    this.filtersApplied = false;

    // Clear all
    this.searchText = null;
    this.hasSearchTerm.set(false);
    this.selectedSortByOption = this.initialSortByOption;
    this.selectedFilterTheme = null;
    this.selectedFilterLocation = null;
    this.hasGeoLocation.set(false);
    this.ukRegionFilterSelected.set(false);
    this.doClearGeoLocation.emit();

    // Clear <biggive-form-field-select> components' internal selectedValue and selectedLabel. DON-654.
    ['sort-by', 'themes', 'categories', 'beneficiaries', 'locations', 'funding'].forEach((id) => {
      const theEl = this.el.nativeElement.querySelector('#' + id) as HTMLBiggiveFormFieldSelectElement | undefined;
      if (!theEl) {
        return;
      }

      theEl.selectedValue = null;
      theEl.selectedLabel = null;
    });

    const selectedFilters = this.el.nativeElement.querySelector('.selected-filters');
    if (selectedFilters) {
      selectedFilters.querySelectorAll('.button').forEach((button: HTMLElement) => {
        button.remove();
      });
    }

    // Emit the doSearchAndFilterUpdate event with null values. DON-654
    this.doSearchAndFilterUpdate.emit({
      searchText: null,
      sortBy: null,
      filterTheme: null,
      filterLocation: null,
    });

    this.ukFilterSelected.set(this.locationFilterIsUK(this.selectedFilterLocation));
  };

  /**
   * We've seen desktop Safari jump to this input when it's focused at times when that's
   * unhelpful, so on a few occasions we proactively blur it.
   */
  private unfocusTextInput() {
    const input = this.el.nativeElement.querySelector('.input-text') as HTMLInputElement | undefined;
    input?.blur();
  }

  constructor() {
    this.filtersApplied = this.selectedFilterTheme !== null || this.selectedFilterLocation !== null;
    this.initialSortByOption = this.selectedSortByOption || 'Most relevant';

    effect(() => {
      this.searchResult();
      this.updateMapBounds();
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private setupMapObserver(element: ElementRef<HTMLDivElement>) {
    this.teardownMap();

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          requestAnimationFrame(() => {
            if (!this.map) {
              this.initMap();
            } else {
              this.map.invalidateSize();
              this.updateMapBounds();
            }
          });
        }
      }
    });

    this.resizeObserver.observe(element.nativeElement);
  }

  private teardownMap() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.map?.remove();
    this.map = undefined;
    this.tileLayer = undefined;
  }

  ngOnDestroy() {
    this.teardownMap();
  }

  public getSelectedSortByValue(): undefined | string {
    const sortByOption = this.selectedSortByOption;
    if (!sortByOption) {
      return undefined;
    }
    const selected = this.sortOptions().filter((option) => {
      return option.label.toLowerCase() === sortByOption.toLowerCase();
    })[0];

    return selected?.value;
  }

  protected optionsToArray(options: string | string[] | Record<string, string>): { label: string; value: string }[] {
    if (typeof options === 'string') {
      options = JSON.parse(options);
    }
    if (Array.isArray(options)) {
      return options.map((option: string) => ({ value: option, label: option }));
    }

    return Object.entries(options).map((entry) => ({ value: entry[0], label: entry[1] }));
  }

  private locationFilterIsUK(location: string | null) {
    return location === 'United Kingdom';
  }

  ngOnChanges(_changes: SimpleChanges<CampaignCardFilterGridUpdatedComponent>) {
    this.initMap();
  }

  protected makeMapFullScreen() {
    this.matomoTracker.trackEvent('search', 'map_fullscreen_entered');
    this.fullScreenMapMode.set(true);
    this.map.attributionControl.setPosition('topright');
    setTimeout(() => this.map.invalidateSize(), 0);
  }

  /**
   * Copied from campaign-info componnent - consider de-duplicating part or all of implementation if it doesn't diverge
   * quickly.
   */
  private async initMap() {
    // Check again in case it got destroyed while waiting
    if (!this.mapElement || !isPlatformBrowser(this.platformId)) return;

    if (!this.map) {
      this.map = new Map(this.mapElement.nativeElement, {
        dragging: false,
        // Setting min + max zoom to the view bounds level alone didn't seem to reliably make controls do nothing.
        // So switching off every way I could find to zoom (the following 6 lines) seems the only safe way to
        // achieve this.
        zoomControl: false,
        boxZoom: false,
        doubleClickZoom: false,
        keyboard: false,
        scrollWheelZoom: false,
        pinchZoom: false,
        zoomSnap: 0.25, // Increases the likelihood of a tight crop around the project area vs. default steps of 1.
      });

      this.updateMapBounds();
    }

    if (!this.tileLayer) {
      this.tileLayer = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.map.eachLayer((layer: any) => {
      if (layer !== this.tileLayer) {
        layer.remove();
      }
    });

    const searchResult = this.searchResult();
    const childRegions = searchResult?.childRegions;
    const hasChildRegions = childRegions && childRegions.length > 0;

    const siblingRegions = searchResult?.parentRegion && searchResult?.siblingRegions;
    const hasSiblingRegions = siblingRegions && siblingRegions.length > 0;

    new GeoJSON(this.highlightAreas, {
      attribution:
        'boundaries &copy; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Crown copyright</a>',
      style: () => ({
        fillColor: '#2c089b',
        fillOpacity: hasChildRegions ? 0 : 0.2,
        color: '#2c089b',
        weight: 1.5,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
        if (feature.properties && feature.properties['name']) {
          layer.bindPopup(feature.properties['name']);
        }
        const center = getPoleOfInaccessibility(feature.geometry) ?? layer.getBounds().getCenter();

        let regionCode: string | undefined = undefined;

        const countObj = this.locationCounts?.find((lc) => {
          const isMatch =
            lc.regionCode ===
            (feature.properties?.['code'] ??
              feature.properties?.['RGN25CD'] ??
              feature.properties?.['CTRY25CD'] ??
              feature.properties?.['CTYUA25CD'] ??
              feature.properties?.['LAD25CD']);

          if (isMatch) {
            regionCode = lc.regionCode;
          }

          return isMatch;
        });
        const isSelected = regionCode === this.selectedFilterUKRegion;
        if (isSelected && hasChildRegions) {
          return;
        }

        const count = countObj !== undefined ? countObj.numCampaigns : 0;
        if (count === 0) {
          // We don't show markers for regions with zero campaigns to make it easier to see the actually useful markers
          // for regions with at least one campaign, especially in visually dense areas like the Scottish Central Belt,
          // south of North West England etc.
          return;
        }

        const areaName = feature.properties?.['name'] || '';

        const markerClass = isSelected ? 'campaign-count-marker selected' : 'campaign-count-marker';
        const markerIcon = new DivIcon({
          className: 'campaign-count-marker-container',
          html: `<button type="button" class="${markerClass}" aria-label="${count} campaigns in ${areaName}">${count}</button>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = new Marker(center, {
          icon: markerIcon,
          title: `${count} campaigns in ${areaName}`,
        }).addTo(this.map);

        if (!isSelected) {
          marker.on('click', () => {
            this.matomoTracker.trackEvent('search', 'map_region_marker_clicked', areaName || regionCode || '');
            this.location = undefined;
            this.doClearGeoLocation.emit();
            this.autoSelectSortByClosest();
            this.selectedFilterUKRegion = countObj!.regionCode;
            this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
          });
        }
      },
    }).addTo(this.map);

    if (hasChildRegions) {
      const childRegionCodes = childRegions.map((region) => region.code);
      new GeoJSON(await getHighlightedFeatures(childRegionCodes, this.httpClient), {
        attribution:
          'boundaries &copy; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Crown copyright</a>',
        style: () => ({
          fillOpacity: 0.1,
          color: '#2c089b',
          weight: 1.5,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
          if (feature.properties && feature.properties['name']) {
            layer.bindPopup(feature.properties['name']);
          }
          const center = getPoleOfInaccessibility(feature.geometry) ?? layer.getBounds().getCenter();

          const childCountObj = this.locationCounts?.find(
            (lc) =>
              lc.regionCode ===
              (feature.properties?.['code'] ??
                feature.properties?.['RGN25CD'] ??
                feature.properties?.['CTRY25CD'] ??
                feature.properties?.['CTYUA25CD'] ??
                feature.properties?.['LAD25CD']),
          );

          const count = childCountObj!.numCampaigns;
          if (count === 0) {
            // We don't show markers for regions with zero campaigns to make it easier to see the actually useful markers
            // for regions with at least one campaign, especially in visually dense areas like the Scottish Central Belt,
            // south of North West England etc.
            return;
          }
          const areaName = feature.properties?.['name'] || '';

          const markerIcon = new DivIcon({
            className: 'campaign-count-marker-container',
            html: `<button type="button" class="campaign-count-marker" aria-label="${areaName}">${count}</button>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = new Marker(center, {
            icon: markerIcon,
            title: `${count} campaigns in ${areaName}`,
          }).addTo(this.map);

          marker.on('click', () => {
            this.matomoTracker.trackEvent(
              'search',
              'geo_chosen',
              `Region clicked: ${areaName || childCountObj?.regionCode || ''}`,
            );
            this.location = undefined;
            this.autoSelectSortByClosest();
            this.doClearGeoLocation.emit();
            this.selectedFilterUKRegion = childCountObj!.regionCode;
            this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
          });
        },
      }).addTo(this.map);
    }

    if (hasSiblingRegions) {
      const siblingRegionCodes = siblingRegions.map((region) => region.code);
      new GeoJSON(await getHighlightedFeatures(siblingRegionCodes, this.httpClient), {
        attribution:
          'boundaries &copy; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Crown copyright</a>',
        style: () => ({
          fillColor: '#2AF135', // placeholder colour
          fillOpacity: 0.1,
          color: '#2c089b',
          weight: 1.5,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
          if (feature.properties && feature.properties['name']) {
            layer.bindPopup(feature.properties['name']);
          }
          const center = getPoleOfInaccessibility(feature.geometry) ?? layer.getBounds().getCenter();

          const countObj = this.locationCounts?.find(
            (lc) =>
              lc.regionCode ===
              (feature.properties?.['code'] ??
                feature.properties?.['RGN25CD'] ??
                feature.properties?.['CTRY25CD'] ??
                feature.properties?.['CTYUA25CD'] ??
                feature.properties?.['LAD25CD']),
          );

          const areaName = feature.properties?.['name'] || '';
          const count = countObj?.numCampaigns || 0;

          if (count === 0) {
            // We don't show markers for regions with zero campaigns to make it easier to see the actually useful markers
            // for regions with at least one campaign, especially in visually dense areas like the Scottish Central Belt,
            // south of North West England etc.
            return;
          }

          const markerIcon = new DivIcon({
            className: 'campaign-count-marker-container',
            html: `<button type="button" class="campaign-count-marker" aria-label="${areaName}">${count}</button>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = new Marker(center, {
            icon: markerIcon,
            title: `${count} campaigns in ${areaName}`,
          }).addTo(this.map);

          marker.on('click', () => {
            this.matomoTracker.trackEvent(
              'search',
              'geo_chosen',
              `Region clicked: ${areaName || countObj?.regionCode || ''}`,
            );
            this.location = undefined;
            this.autoSelectSortByClosest();
            this.doClearGeoLocation.emit();
            this.selectedFilterUKRegion = countObj!.regionCode;
            this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
          });
        },
      }).addTo(this.map);
    }

    const exitFullScreenButtonIcon = new DivIcon({
      className: 'exit-full-screen-map-button-container',
      html: `<button type="button" class="exit-full-screen-map-button" aria-label="Close full screen map">X</button>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const exitFullScreenMarker = new Marker([60.7, 1.5], {
      icon: exitFullScreenButtonIcon,
      title: 'Exit full screen map',
    }).addTo(this.map);
    exitFullScreenMarker.on('click', () => {
      this.matomoTracker.trackEvent('search', 'map_fullscreen_exited');
      this.fullScreenMapMode.set(false);
      this.map.attributionControl.setPosition('bottomright');
      setTimeout(() => this.map.invalidateSize(), 0);
    });
  }

  private async updateMapBounds() {
    if (!this.map) return;

    const currentRequestId = ++this.latestBoundsRequestId;
    const UKFilterRegions = this.searchResult()?.UKFilterRegions;

    if (UKFilterRegions && UKFilterRegions.length > 0) {
      const UKFilterRegionsCodes = UKFilterRegions.map((region) => region.code);
      const regionsGeo = await getHighlightedFeatures(UKFilterRegionsCodes, this.httpClient);

      // If another request or reset has happened while fetching, abort applying stale bounds
      if (currentRequestId !== this.latestBoundsRequestId) {
        return;
      }

      if (regionsGeo.length === 0) {
        return;
      }

      const geoJsonLayer = new GeoJSON(regionsGeo);
      const bounds = geoJsonLayer.getBounds();

      if (bounds.isValid()) {
        this.map.fitBounds(bounds, this.boundsOptions());
      }
    } else {
      const UKBounds: [[number, number], [number, number]] = [
        [49.8, -8.7],
        [60.9, 1.8],
      ];
      this.map.fitBounds(UKBounds, this.boundsOptions());
    }
  }

  protected showUkMap(): boolean {
    return (
      this.ukFilterSelected() ||
      this.hasGeoLocation() ||
      this.searchService.hasGeoLocationSet() ||
      !!this.selectedFilterUKRegion ||
      !!this.searchService.selected['ukRegion']
    );
  }

  protected onZoomOutClicked(): void {
    this.matomoTracker.trackEvent('search', 'map_zoom_out_clicked', this.zoomOutLabel);
    this.selectedFilterUKRegion = this.searchResult()?.parentRegion?.code ?? null;
    this.doClearGeoLocation.emit();
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  }

  protected get zoomOutLabel(): string {
    let parentRegionName = this.searchResult()?.parentRegion?.name;

    if (parentRegionName?.toLocaleLowerCase() === 'london, england') {
      // there will be other cases where the parent Region name is longer than it needs to be for clarity,
      // but just fixing this as a special case for now since it will be one of the most frequently viewed and
      // we can generalise to others.
      parentRegionName = 'London';
    }

    return parentRegionName ? `Back to ${parentRegionName}` : 'Back to UK';
  }

  protected getSelectedCountry(
    countries: { country: string; numCampaigns: number }[],
  ): { country: string; numCampaigns: number } | undefined {
    return countries.find((c) => c.country === this.selectedFilterLocation);
  }

  protected getSelectedTheme(
    themes: { theme: string; numCampaigns: number }[],
  ): { theme: string; numCampaigns: number } | undefined {
    return themes.find((t) => t.theme === this.selectedFilterTheme);
  }

  protected regionSelectOptions(): { label: string; value: string }[] {
    const searchResult = this.searchResult();
    if (!searchResult) {
      return [];
    }

    const firstUKRegion = searchResult.UKFilterRegions?.[0];
    if (!firstUKRegion) {
      // not quite sure why this is ever being called when there are no UKFilterRegions in the search result,
      // but we were seeing an error thrown here repeatedly on staging, so now just console logging and returning.

      console.log('Missing first UK region for region-select');

      return [];
    }

    const childRegions = searchResult?.childRegions;
    const siblingRegions = this.searchResult()?.siblingRegions;
    const parentRegion = this.searchResult()?.parentRegion;

    return [
      {
        label: firstUKRegion.name,
        value: firstUKRegion.code,
      },
      ...this.formatRegionsForSelect(childRegions),
      ...(this.searchResult()?.parentRegion ? this.formatRegionsForSelect(siblingRegions) : []),
      ...(parentRegion ? [{ label: parentRegion.name, value: parentRegion.code }] : []),
    ].sort((a, b) => a.label.localeCompare(b.label));
    // todo - consider  campaign counts.
  }

  private formatRegionsForSelect(regions: UKRegion[] | undefined): { label: string; value: string }[] {
    const searchResult = this.searchResult();

    if (!regions) {
      return [];
    }

    if (!searchResult) {
      return [];
    }

    const regionsWithAtLeastOneCampaign = regions.filter((ukRegion) => {
      const count = searchResult.locationCounts?.filter(
        (locationCount) => locationCount.regionCode === ukRegion.code,
      )[0];
      return count && count.numCampaigns > 0;
    });

    return regionsWithAtLeastOneCampaign.map((region) => ({
      label: region.name,
      value: region.code,
    }));
  }
}
