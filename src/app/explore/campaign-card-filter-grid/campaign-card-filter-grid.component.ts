import { Component, ElementRef, inject, Input, output, signal, ViewChild, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SearchService } from '../../search.service';
import { COUNTRY_CODE } from '../../country-code.token';
import { flags } from '../../featureFlags';
import { BiggiveButton, BiggiveFormFieldSelect, BiggivePopup } from '@biggive/components-angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { GeoJSON, Map, TileLayer } from 'leaflet';

const sortOptionLabels = {
  relevance: 'Relevance',
  amountRaised: 'Most raised',
  leastRaised: 'Least raised',
  closeToTarget: 'Nearest target',
  matchFundsRemaining: 'Most funds remaining',
} as const;

export type sortOptionKey = keyof typeof sortOptionLabels;
export type sortOptionLabel = (typeof sortOptionLabels)[sortOptionKey];

@Component({
  selector: 'app-campaign-card-filter-grid',
  imports: [BiggiveButton, BiggivePopup, BiggiveFormFieldSelect, FaIconComponent],
  templateUrl: './campaign-card-filter-grid.component.html',
  styleUrl: './campaign-card-filter-grid.component.scss',
})
export class CampaignCardFilterGridComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  protected sortOptions = this.getSortOptions();

  /**
   * JSON array of category key/values
   */
  @Input({ required: true }) categoryOptions!: string[];

  /**
   * JSON array of beneficiary key/values
   */
  @Input({ required: true }) beneficiaryOptions!: string[];

  /**
   * JSON array of location key/values
   */
  @Input({ required: true }) locationOptions!: string[];
  protected searchService = inject(SearchService);
  protected flags = flags;
  protected clientCountryCode = inject(COUNTRY_CODE, { optional: true });

  /**
   * Selected location around which donor is looking for campaigns
   */
  @Input({ required: true }) location: GeolocationPosition | undefined;

  /**
   * Indicates that the component is currently fetching the browser location
   */
  @Input({ required: true }) fetchingLocation!: boolean;

  protected sortByPlaceholderText = 'Sort by';
  protected beneficiariesPlaceHolderText = 'Select beneficiary';
  protected categoriesPlaceHolderText = 'Select category';
  protected locationsPlaceHolderText = 'Select location';
  private initialSortByOption: sortOptionLabel;

  /**
   * This and similar properties represent selections made in the popup but not yet applied.
   */
  private newSelectedFilterCategory: string | null = null;
  private newSelectedFilterBeneficiary: string | null = null;
  private newSelectedFilterLocation: string | null = null;

  @ViewChild('root') el!: ElementRef;

  doSearchAndFilterUpdate = output<{
    searchText: string | null;
    sortBy: string | null;
    filterCategory: string | null;
    filterBeneficiary: string | null;
    filterLocation: string | null;
  }>();

  doGetLocationFromBrowser = output<void>();
  protected faMagnifyingGlass = faMagnifyingGlass;

  /**
   * Typically on non-negligible scroll away from the search area.
   */
  async unfocusInputs() {
    this.unfocusTextInput();
  }

  /**
   * Space below component
   */
  spaceBelow: number = 0;

  intro: string = 'Find a charity or project';

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
   * Defines the text displayed as the placeholder in the input field
   * before the user types anything
   */
  placeholderText: string = 'Search';

  /**
   * Defines the text on the search button
   */
  buttonText: string = 'Search';

  /**
   * This helps us inject a pre-selected dropdown value from outside of this component.
   * This is especially helpful for the Meta campaign and Explore pages, where searching
   * by text wipes out previous sort options and re-uses Relevance, or where one of those
   * two pages is loaded directly with URL parameters - in such a scenario the dropdown
   * shows that it's pre-selected. DON-558.
   */
  @Input({ required: true }) selectedSortByOption!: sortOptionLabel | null;

  /**
   * For injecting the chosen category to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Input({ required: true }) selectedFilterCategory: string | null = null;

  /**
   * For injecting the chosen beneficiary to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Input({ required: true }) selectedFilterBeneficiary: string | null = null;

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

  private readonly boundsPadding = [8, 8];
  private projectBounds?: DOMRect;
  private resizeObserver?: ResizeObserver;

  /**
   * Allow donors to select campaigns near to themselves.
   */
  enableSearchByLocation = flags.enableSearchByLocation;

  @Input({ required: true }) offerNearMeOption!: boolean;

  protected filtersApplied: boolean;

  @ViewChild('mapElement') set mapElement(element: ElementRef<HTMLDivElement> | undefined) {
    this._mapElement = element;
    if (element && isPlatformBrowser(this.platformId)) {
      this.setupMapObserver(element);
    } else {
      this.teardownMap();
    }
  }
  get mapElement(): ElementRef<HTMLDivElement> | undefined {
    return this._mapElement;
  }
  private _mapElement: ElementRef<HTMLDivElement> | undefined;

  protected categoryFilterSelectionChanged = (value: string) => {
    this.newSelectedFilterCategory = value;
  };

  protected beneficiarySelectionChanged = (value: string) => {
    this.newSelectedFilterBeneficiary = value;
  };

  protected locationSelectionChanged = (value: string) => {
    this.newSelectedFilterLocation = value;
  };

  protected sortBySelectionChanged = (value: sortOptionLabel | string) => {
    // @ts-expect-error getting Type string is not assignable to type sortOptionLabel | null . Maybe somethign we can 'grandfather' from before port from stencil.
    this.selectedSortByOption = value;
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  };

  private getSearchAndFilterObject() {
    return {
      searchText: this.searchText,
      sortBy: this.selectedSortByOption,
      filterCategory: this.selectedFilterCategory,
      filterBeneficiary: this.selectedFilterBeneficiary,
      filterLocation: this.selectedFilterLocation,
    };
  }

  protected handleApplyFilterButtonClick = () => {
    this.selectedFilterCategory = this.newSelectedFilterCategory ?? this.selectedFilterCategory;
    this.selectedFilterBeneficiary = this.newSelectedFilterBeneficiary ?? this.selectedFilterBeneficiary;
    this.selectedFilterLocation = this.newSelectedFilterLocation ?? this.selectedFilterLocation;

    const searchAndFilterObj = this.getSearchAndFilterObject();
    this.doSearchAndFilterUpdate.emit(searchAndFilterObj);

    const filterPopup = this.el.nativeElement.querySelector('#filter-popup') as HTMLBiggivePopupElement | undefined;
    if (filterPopup) {
      filterPopup.closeFromOutside();
    }

    this.filtersApplied =
      typeof searchAndFilterObj.filterBeneficiary === 'string' ||
      typeof searchAndFilterObj.filterCategory === 'string' ||
      typeof searchAndFilterObj.filterLocation === 'string';

    this.ukFilterSelected.set(this.locationFilterIsUK(this.selectedFilterLocation));
  };

  protected removeFilter(filterKey: 'locations' | 'categories' | 'beneficiaries') {
    switch (filterKey) {
      case 'beneficiaries':
        this.selectedFilterBeneficiary = null;
        break;
      case 'categories':
        this.selectedFilterCategory = null;
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
    if (!selectEl) {
      return;
    }

    selectEl.selectedLabel = null;
    selectEl.selectedValue = null;
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  }

  protected handleSearchButtonPressed = () => {
    this.unfocusTextInput();
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());

    if (this.hasSearchTerm()) {
      this.selectedSortByOption = 'Relevance';
    }
  };

  protected handleNearMeButtonPressed = () => {
    this.unfocusTextInput();
    this.doGetLocationFromBrowser.emit();
  };

  protected handleSearchTextChanged = (event: Event) => {
    // @ts-expect-error - we know it will be from an input element so will have a value.
    this.searchText = event.target.value;
  };

  protected handleEnterPressed = (ev: Event) => {
    const keyboardEvent = ev as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      this.unfocusTextInput();
      this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
    }
  };

  protected handleFilterButtonClick = () => {
    this.newSelectedFilterBeneficiary = this.selectedFilterBeneficiary;
    this.newSelectedFilterCategory = this.selectedFilterCategory;
    this.newSelectedFilterLocation = this.selectedFilterLocation;

    console.log([this.el, this.el.nativeElement]);
    const filterPopup = this.el.nativeElement.querySelector('#filter-popup') as HTMLBiggivePopupElement | undefined;
    if (filterPopup) {
      filterPopup.openFromOutside();
    }

    this.ukFilterSelected.set(this.locationFilterIsUK(this.selectedFilterLocation));
  };

  protected handleClearAll = () => {
    this.unfocusTextInput();

    // Set the 'Filters' button back to the primary background colour
    this.filtersApplied = false;

    // Clear all
    this.searchText = null;
    this.selectedSortByOption = this.initialSortByOption;
    this.selectedFilterBeneficiary = null;
    this.selectedFilterCategory = null;
    this.selectedFilterLocation = null;

    // Clear <biggive-form-field-select> components' internal selectedValue and selectedLabel. DON-654.
    ['sort-by', 'categories', 'beneficiaries', 'locations', 'funding'].forEach((id) => {
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
      filterCategory: null,
      filterBeneficiary: null,
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
    this.filtersApplied =
      this.selectedFilterCategory !== null ||
      this.selectedFilterBeneficiary !== null ||
      this.selectedFilterLocation !== null;
    this.initialSortByOption = this.selectedSortByOption || 'Relevance';
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
              const UKBounds: [[number, number], [number, number]] = [
                [49.8, -8.7],
                [60.9, 1.8],
              ];
              this.map.fitBounds(UKBounds, { padding: this.boundsPadding });
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
  }

  ngOnDestroy() {
    this.teardownMap();
  }

  public getSelectedValue(): undefined | string {
    const sortByOption = this.selectedSortByOption;
    if (!sortByOption) {
      return undefined;
    }
    const sortOptions = this.getSortOptions();
    const selected = sortOptions.filter((option) => {
      return option.label.toLowerCase() === sortByOption.toLowerCase();
    })[0];

    return selected?.value;
  }

  private getSortOptions(): {
    label: sortOptionLabel;
    value: sortOptionKey;
  }[] {
    // @ts-expect-error  - see https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    const sortOptionKeys: sortOptionKey[] = Object.getOwnPropertyNames(sortOptionLabels);
    const relevantOptionKeys = sortOptionKeys.filter((key) => key !== 'relevance' || this.hasSearchTerm());

    return relevantOptionKeys.map((key: sortOptionKey) => ({ value: key, label: sortOptionLabels[key] }));
  }

  private hasSearchTerm() {
    return typeof this.searchText === 'string' && this.searchText.length > 0;
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

  protected readonly faExclamationTriangle = faExclamationTriangle;

  private locationFilterIsUK(location: string | null) {
    return location === 'United Kingdom';
  }

  /**
   * Copied from campaign-info componnent - consider de-duplicating part or all of implementation if it doesn't diverge
   * quickly.
   */
  private async initMap() {
    // Check again in case it got destroyed while waiting
    if (!this.mapElement || !isPlatformBrowser(this.platformId)) return;

    const UKBounds: [[number, number], [number, number]] = [
      [49.8, -8.7],
      [60.9, 1.8],
    ];

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
      touchZoom: false,
      zoomSnap: 0.25, // Increases the likelihood of a tight crop around the project area vs. default steps of 1.
    }).fitBounds(UKBounds, { padding: this.boundsPadding });

    // Build a layer with just project-relevant locations and a list of their names
    const highlightAreas = [] as const;

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const projectLayer = new GeoJSON(highlightAreas, {
      attribution:
        'boundaries &copy; <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Crown copyright</a>',
      style: () => ({
        fillColor: '#2c089b',
        fillOpacity: 0.2,
        color: '#2c089b',
        weight: 1.5,
      }),
    }).addTo(this.map);

    this.projectBounds = projectLayer.getBounds();
  }
}
