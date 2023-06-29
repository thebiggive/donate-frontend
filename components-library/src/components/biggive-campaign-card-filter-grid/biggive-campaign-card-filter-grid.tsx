import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';

@Component({
  tag: 'biggive-campaign-card-filter-grid',
  styleUrl: 'biggive-campaign-card-filter-grid.scss',
  shadow: true,
})
export class BiggiveCampaignCardFilterGrid {
  @Element() el;

  /**
   * This event `doSearchAndFilterUpdate` event is emitted and propogates to the parent
   * component which handles it
   */
  @Event({
    eventName: 'doSearchAndFilterUpdate',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doSearchAndFilterUpdate: EventEmitter<{
    searchText: string | null;
    sortBy: string | null;
    filterCategory: string | null;
    filterBeneficiary: string | null;
    filterLocation: string | null;
    filterFunding: string | null;
  }>;

  sortByPlaceholderText = 'Sort by';
  beneficiariesPlaceHolderText = 'Select beneficiary';
  categoriesPlaceHolderText = 'Select category';
  locationsPlaceHolderText = 'Select location';
  fundingPlaceHolderText = 'Select funding';

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Intro
   */
  @Prop() intro: string = 'Find a charity or project';

  /**
   * Optional search text prop. Useful for pre-populating the search field
   * when the page is loaded with a search term already existing in the URL.
   * This can happen when sharing links, or if a donor goes to a campaign page
   * after searching, and then returns to the search results. In such a case,
   * the search box text will clear, unless we use this prop to populate it on
   * rendering. DON-652.
   */
  @Prop() searchText: string | null = null;

  /**
   * Defines the text displayed as the placeholder in the input field
   * before the user types anything
   */
  @Prop() placeholderText: string = 'Search';

  /**
   * Defines the text on the search button
   */
  @Prop() buttonText: string = 'Search';

  /**
   * JSON array of category key/values, or takes a stringified equiavalent (for Storybook)
   */
  @Prop() categoryOptions: string | Record<string, string>;

  /**
   * JSON array of beneficiary key/values, or takes a stringified equiavalent (for Storybook)
   */
  @Prop() beneficiaryOptions: string | Record<string, string>;

  /**
   * JSON array of location key/values, or takes a stringified equiavalent (for Storybook)
   */
  @Prop() locationOptions: string | Record<string, string>;

  /**
   * JSON array of funding key/values, or takes a stringified equiavalent (for Storybook)
   */
  @Prop() fundingOptions: string | Record<string, string>;

  /**
   * This helps us inject a pre-selected dropdown value from outside of this component.
   * This is especially helpful for the Meta campaign and Explore pages, where searching
   * by text wipes out previous sort options and re-uses Relevance, or where one of those
   * two pages is loaded directly with URL parameters - in such a scenario the dropdown
   * shows that it's pre-selected. DON-558.
   */
  @Prop({ mutable: true }) selectedSortByOption: 'Most raised' | 'Match funds remaining' | 'Relevance';

  /**
   * For injecting the chosen category to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Prop({ mutable: true }) selectedFilterCategory: string | null = null;

  /**
   * For injecting the chosen beneficiary to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Prop({ mutable: true }) selectedFilterBeneficiary: string | null = null;

  /**
   * For injecting the chosen location to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Prop({ mutable: true }) selectedFilterLocation: string | null = null;

  /**
   * For injecting the chosen funding to filter by, as per the comment above for `selectedSortByOption`.
   */
  @Prop({ mutable: true }) selectedFilterFunding: string | null = null;

  /**
   * State variable - causes re-render on change
   */
  @State() filtersApplied: boolean;

  private initialSortByOption: 'Most raised' | 'Match funds remaining' | 'Relevance';

  categoryFilterSelectionChanged = (value: string) => {
    this.selectedFilterCategory = value;
  };

  beneficiarySelectionChanged = (value: string) => {
    this.selectedFilterBeneficiary = value;
  };

  locationSelectionChanged = (value: string) => {
    this.selectedFilterLocation = value;
  };

  fundingelectionChanged = (value: string) => {
    this.selectedFilterFunding = value;
  };

  sortByelectionChanged = (value: 'Most raised' | 'Match funds remaining' | 'Relevance') => {
    this.selectedSortByOption = value;
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  };

  private getSearchAndFilterObject(): {
    searchText: string;
    sortBy: string;
    filterCategory: string;
    filterBeneficiary: string;
    filterLocation: string;
    filterFunding: string;
  } {
    const event: {
      searchText: string | null;
      sortBy: string | null;
      filterCategory: string | null;
      filterBeneficiary: string | null;
      filterLocation: string | null;
      filterFunding: string | null;
    } = {
      searchText: this.searchText,
      sortBy: this.selectedSortByOption,
      filterCategory: this.selectedFilterCategory,
      filterBeneficiary: this.selectedFilterBeneficiary,
      filterFunding: this.selectedFilterFunding,
      filterLocation: this.selectedFilterLocation,
    };

    // @ts-ignore
    return event;
  }

  private handleApplyFilterButtonClick = () => {
    const searchAndFilterObj = this.getSearchAndFilterObject();
    this.doSearchAndFilterUpdate.emit(searchAndFilterObj);
    this.el.shadowRoot.getElementById('filter-popup').closeFromOutside();

    const selectedFilters = this.el.shadowRoot.querySelector('.selected-filters');

    selectedFilters.querySelectorAll('.button').forEach(button => {
      button.remove();
    });

    let filters = {
      beneficiaries: searchAndFilterObj.filterBeneficiary,
      categories: searchAndFilterObj.filterCategory,
      funding: searchAndFilterObj.filterFunding,
      locations: searchAndFilterObj.filterLocation,
    };

    for (var id in filters) {
      if (typeof filters[id] === 'string') {
        let button = document.createElement('span');
        button.classList.add('button');
        button.dataset.id = id;
        button.innerText = filters[id];
        selectedFilters.appendChild(button);
        button.addEventListener('click', () => {
          button.remove();
          this.el.shadowRoot.getElementById(button.dataset.id).selectedValue = null;
          this.el.shadowRoot.getElementById(button.dataset.id).selectedLabel = null;
        });
      }
    }

    this.filtersApplied =
      typeof searchAndFilterObj.filterBeneficiary === 'string' ||
      typeof searchAndFilterObj.filterCategory === 'string' ||
      typeof searchAndFilterObj.filterFunding === 'string' ||
      typeof searchAndFilterObj.filterLocation === 'string';
  };

  private handleSearchButtonPressed = () => {
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
  };

  private handleSearchTextChanged = (event: any) => {
    this.searchText = event.target.value;
  };

  private handleEnterPressed = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
    }
  };

  private handleFilterButtonClick = () => {
    this.el.shadowRoot.getElementById('filter-popup').openFromOutside();
  };

  private handleClearAll = () => {
    // Set the 'Filters' button back to the primary background colour
    this.filtersApplied = false;

    // Clear all
    this.searchText = null;
    this.selectedSortByOption = this.initialSortByOption;
    this.selectedFilterBeneficiary = null;
    this.selectedFilterCategory = null;
    this.selectedFilterFunding = null;
    this.selectedFilterLocation = null;

    // Clear <biggive-form-field-select> components' internal selectedValue and selectedLabel. DON-654.
    ['sort-by', 'categories', 'beneficiaries', 'locations', 'funding'].forEach(id => {
      this.el.shadowRoot.getElementById(id).selectedValue = null;
      this.el.shadowRoot.getElementById(id).selectedLabel = null;
    });

    const selectedFilters = this.el.shadowRoot.querySelector('.selected-filters');

    selectedFilters.querySelectorAll('.button').forEach(button => {
      button.remove();
    });

    // Emit the doSearchAndFilterUpdate event with null values. DON-654
    this.doSearchAndFilterUpdate.emit({
      searchText: null,
      sortBy: null,
      filterCategory: null,
      filterBeneficiary: null,
      filterFunding: null,
      filterLocation: null,
    });
  };

  componentWillRender() {
    this.filtersApplied =
      this.selectedFilterCategory !== null || this.selectedFilterBeneficiary !== null || this.selectedFilterFunding !== null || this.selectedFilterLocation !== null;
    this.initialSortByOption = this.selectedSortByOption;
  }

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="search-wrap">
            <h4>{this.intro}</h4>
            <div class="field-wrap">
              <div class="input-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                  <path d={faMagnifyingGlass.icon[4].toString()} />
                </svg>
                <input
                  type="text"
                  value={this.searchText ?? ''}
                  class="input-text"
                  placeholder={this.placeholderText}
                  onInput={this.handleSearchTextChanged}
                  onKeyDown={this.handleEnterPressed}
                />
              </div>
              <biggive-button onClick={this.handleSearchButtonPressed} label={this.buttonText} />
            </div>
          </div>
          <div class="sort-filter-wrap">
            <div class="filter-wrap">
              <biggive-button class="filter" colourScheme="primary" onClick={this.handleFilterButtonClick} label="Filter" fullWidth={true} space-below="0"></biggive-button>
              <biggive-popup id="filter-popup">
                <h4 class="space-above-0 space-below-3 text-colour-primary">Filters</h4>
                <div class="select-wrapper-1">
                  <biggive-form-field-select
                    backgroundColour="white"
                    prompt="Category"
                    placeholder={this.categoriesPlaceHolderText}
                    selectedLabel={this.selectedFilterCategory}
                    options={this.categoryOptions}
                    onSelectionChange={this.categoryFilterSelectionChanged}
                    id="categories"
                    space-below="2"
                  ></biggive-form-field-select>
                </div>

                <div class="select-wrapper-2">
                  <biggive-form-field-select
                    backgroundColour="white"
                    prompt="Beneficiary"
                    placeholder={this.beneficiariesPlaceHolderText}
                    selectedLabel={this.selectedFilterBeneficiary}
                    options={this.beneficiaryOptions}
                    onSelectionChange={this.beneficiarySelectionChanged}
                    id="beneficiaries"
                    space-below="2"
                  ></biggive-form-field-select>
                </div>

                <div class="select-wrapper-3">
                  <biggive-form-field-select
                    backgroundColour="white"
                    prompt="Location"
                    placeholder={this.locationsPlaceHolderText}
                    selectedLabel={this.selectedFilterLocation}
                    options={this.locationOptions}
                    onSelectionChange={this.locationSelectionChanged}
                    id="locations"
                    space-below="2"
                  ></biggive-form-field-select>
                </div>

                <div class="select-wrapper-4">
                  <biggive-form-field-select
                    backgroundColour="white"
                    prompt="Funding"
                    placeholder={this.fundingPlaceHolderText}
                    selectedLabel={this.selectedFilterFunding}
                    options={this.fundingOptions}
                    onSelectionChange={this.fundingelectionChanged}
                    id="funding"
                    space-below="2"
                  ></biggive-form-field-select>
                </div>
                <div class="align-right">
                  <biggive-button label="Apply filters" onClick={this.handleApplyFilterButtonClick} />
                </div>
              </biggive-popup>
            </div>

            <div class="sort-wrap">
              <biggive-form-field-select
                options={{ amountRaised: 'Most raised', matchFundsRemaining: 'Match funds remaining' }}
                prompt={null}
                select-style="underlined"
                placeholder={this.sortByPlaceholderText}
                selectedLabel={this.selectedSortByOption}
                onSelectionChange={this.sortByelectionChanged}
                id="sort-by"
              >
                <biggive-form-field-select-option value="amountRaised" label="Most raised"></biggive-form-field-select-option>
                <biggive-form-field-select-option value="matchFundsRemaining" label="Match funds remaining"></biggive-form-field-select-option>
                {(this.searchText || '').length > 0 ? <biggive-form-field-select-option value="Relevance" label="Relevance"></biggive-form-field-select-option> : null}
              </biggive-form-field-select>
            </div>
          </div>
          <div class="selected-filter-wrap">
            <div class="selected-filters"></div>
            <div class="clear-all">
              <a onClick={this.handleClearAll}>Clear all</a>
            </div>
          </div>
          <div class="campaign-grid">
            <slot name="campaign-grid"></slot>
          </div>
        </div>
      </div>
    );
  }
}
