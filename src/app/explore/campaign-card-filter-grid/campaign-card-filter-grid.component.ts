import {Component, ElementRef, inject, Input, output, ViewChild} from '@angular/core';
import { SearchService } from '../../search.service';
import { COUNTRY_CODE } from '../../country-code.token';
import { flags } from '../../featureFlags';
import {
  BiggiveButton,
  BiggiveFormFieldSelect,
  BiggivePopup
} from '@biggive/components-angular';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faExclamationTriangle, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
// import {options} from 'axios' - was used in Stencil component, may not be needed now.;

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
export class CampaignCardFilterGridComponent {
  private sortOptions = this.getSortOptions();

  /**
   * JSON array of category key/values
   */
  @Input({required: true}) categoryOptions!: string[];

  /**
   * JSON array of beneficiary key/values
   */
  @Input({required: true}) beneficiaryOptions!: string[];

  /**
   * JSON array of location key/values
   */
  @Input({required: true}) locationOptions!: string[];
  protected searchService = inject(SearchService);
  protected flags = flags;
  protected clientCountryCode = inject(COUNTRY_CODE, {optional: true});

  /**
   * Selected location around which donor is looking for campaigns
   */
  @Input({required: true}) location: GeolocationPosition | undefined;

  /**
   * Indicates that the component is currently fetching the browser location
   */
  @Input({required: true}) fetchingLocation!: boolean;

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
  searchText: string | null = null;

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
  selectedSortByOption = this.searchService.selectedSortLabel || 'Relevance';

  /**
   * For injecting the chosen category to filter by, as per the comment above for `selectedSortByOption`.
   */
  selectedFilterCategory: string | null = null;

  /**
   * For injecting the chosen beneficiary to filter by, as per the comment above for `selectedSortByOption`.
   */
  selectedFilterBeneficiary: string | null = null;

  /**
   * For injecting the chosen location to filter by, as per the comment above for `selectedSortByOption`.
   */
  selectedFilterLocation: string | null = null;

  /**
   * Allow donors to select campaigns near to themselves.
   */
  enableSearchByLocation = flags.enableSearchByLocation;

  @Input({required: true}) offerNearMeOption!: boolean;

  protected filtersApplied: boolean;

  protected categoryFilterSelectionChanged = (value: string) => {
    this.newSelectedFilterCategory = value;
  };

  protected beneficiarySelectionChanged = (value: string) => {
    this.newSelectedFilterBeneficiary = value;
  };

  protected locationSelectionChanged = (value: string) => {
    this.newSelectedFilterLocation = value;
  };

  protected sortBySelectionChanged = (value: sortOptionLabel|string) => {
    // @ts-expect-error
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

  private handleApplyFilterButtonClick = () => {
    this.selectedFilterCategory = this.newSelectedFilterCategory ?? this.selectedFilterCategory;
    this.selectedFilterBeneficiary = this.newSelectedFilterBeneficiary ?? this.selectedFilterBeneficiary;
    this.selectedFilterLocation = this.newSelectedFilterLocation ?? this.selectedFilterLocation;

    const searchAndFilterObj = this.getSearchAndFilterObject();
    this.doSearchAndFilterUpdate.emit(searchAndFilterObj);

    const filterPopup = this.el.nativeElement.getElementById('filter-popup') as HTMLBiggivePopupElement | undefined;
    if (filterPopup) {
      filterPopup.closeFromOutside();
    }

    this.filtersApplied =
      typeof searchAndFilterObj.filterBeneficiary === 'string' || typeof searchAndFilterObj.filterCategory === 'string' || typeof searchAndFilterObj.filterLocation === 'string';
  };

  private removeFilter(filterKey: 'locations' | 'categories' | 'beneficiaries') {
    switch (filterKey) {
      case 'beneficiaries':
        this.selectedFilterBeneficiary = null;
        break;
      case 'categories':
        this.selectedFilterCategory = null;
        break;
      case 'locations':
        this.selectedFilterLocation = null;
        break;
      default:
        // This asks the compiler to check that we are in dead code, i.e. we covered all the possible filter keys
        // above. If we missed one we would get a compile error trying to assign a string to a never.
        const exhaustiveSwitch: never = filterKey;
        console.error(exhaustiveSwitch);
    }

    const selectEl = this.el.nativeElement.getElementById(filterKey) as HTMLBiggiveFormFieldSelectElement | undefined;
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

  private handleSearchTextChanged = (event: any) => {
    this.searchText = event.target.value;
  };

  private handleEnterPressed = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      this.unfocusTextInput();
      this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
    }
  };

  protected handleFilterButtonClick = () => {
    this.newSelectedFilterBeneficiary = this.selectedFilterBeneficiary;
    this.newSelectedFilterCategory = this.selectedFilterCategory;
    this.newSelectedFilterLocation = this.selectedFilterLocation;

    console.log([this.el, this.el.nativeElement])
    const filterPopup = this.el.nativeElement.querySelector('#filter-popup') as HTMLBiggivePopupElement | undefined;
    if (filterPopup) {
      filterPopup.openFromOutside();
    }
  };

  private handleClearAll = () => {
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
    ['sort-by', 'categories', 'beneficiaries', 'locations', 'funding'].forEach(id => {
      const theEl = this.el.nativeElement.getElementById(id) as HTMLBiggiveFormFieldSelectElement | undefined;
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
    this.filtersApplied = this.selectedFilterCategory !== null || this.selectedFilterBeneficiary !== null || this.selectedFilterLocation !== null;
    this.initialSortByOption = this.selectedSortByOption;
  }

  public getSelectedValue(): undefined | string {
      const sortByOption = this.selectedSortByOption;
      if (sortByOption === undefined) {
        return undefined;
      }
      const sortOptions = this.getSortOptions();
      const selected = sortOptions.filter(option => {
        return option.label.toLowerCase() === sortByOption.toLowerCase();
      })[0];

      return selected?.value;
    }

  private getSortOptions(): {
      label: sortOptionLabel;
      value: sortOptionKey;
    }[] {
      // @ts-ignore  - see https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
      const sortOptionKeys: sortOptionKey[] = Object.getOwnPropertyNames(sortOptionLabels);
      const relevantOptionKeys = sortOptionKeys.filter(key => key !== 'relevance' || this.hasSearchTerm());

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

      return Object.entries(options).map(entry => ({ value: entry[0], label: entry[1] }));
    }

  protected readonly faExclamationTriangle = faExclamationTriangle;
}
