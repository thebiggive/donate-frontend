import { Component, h, Element, Prop, Event, EventEmitter, Listen } from '@stencil/core';
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
    searchText: string;
    sortBy: string;
    filterCategory: string;
    filterBeneficiary: string;
    filterLocation: string;
    filterFunding: string;
  }>;

  searchText: string = null;
  sortBy: string = null;
  filterCategory: string = null;
  filterBeneficiary: string = null;
  filterLocation: string = null;
  filterFunding: string = null;

  sortByPlaceholderText = 'Sort by';

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Intro
   */
  @Prop() intro: string = 'Find a charity or project';

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
   * JSON array of category key/values
   */
  @Prop() categoryOptions: string[] = [];

  /**
   * JSON array of beneficiary key/values
   */
  @Prop() beneficiaryOptions: string[] = [];

  /**
   * JSON array of location key/values
   */
  @Prop() locationOptions: string[] = [];

  /**
   * JSON array of funding key/values
   */
  @Prop() fundingOptions: string[] = [];

  private getSearchAndFilterObject(): {
    searchText: string;
    sortBy: string;
    filterCategory: string;
    filterBeneficiary: string;
    filterLocation: string;
    filterFunding: string;
  } {
    const event: {
      searchText: string;
      sortBy: string;
      filterCategory: string;
      filterBeneficiary: string;
      filterLocation: string;
      filterFunding: string;
    } = {
      searchText: this.searchText,
      sortBy: this.sortBy,
      filterCategory: this.filterCategory,
      filterBeneficiary: this.filterBeneficiary,
      filterFunding: this.filterFunding,
      filterLocation: this.filterLocation,
    };

    return event;
  }

  @Listen('doSelectChange')
  doOptionSelectCompletedHandler(event) {
    this.sortBy = this.el.shadowRoot.getElementById('sort-by').selectedValue;
    this.filterCategory = this.el.shadowRoot.getElementById('categories').selectedValue;
    this.filterBeneficiary = this.el.shadowRoot.getElementById('beneficiaries').selectedValue;
    this.filterLocation = this.el.shadowRoot.getElementById('locations').selectedValue;
    this.filterFunding = this.el.shadowRoot.getElementById('funding').selectedValue;

    // If this method was trigerred by the selection of a 'Sort by' dropdown option, then
    // emit an event to search, but do NOT emit an event for example when filter options
    // are selected, until the 'Apply filters' button is pressed which is handled separately
    // by `handleApplyFilterButtonClick()`.
    // Additional note -> we could, instead, do this:
    // `<biggive-form-field-select placeholder="Sort by" id="sort-by" onDoSelectChange={this.someHandleMethod}>`
    // but the problem with that is that `someHandleMethod` gets called first and then this
    // method gets called, leading to two calls and more risk for error. DON-570.
    if (event.detail.placeholder === this.sortByPlaceholderText) {
      console.log('emitting event:');
      console.log(this.getSearchAndFilterObject());
      this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
    }
  }

  private handleApplyFilterButtonClick = () => {
    this.doSearchAndFilterUpdate.emit(this.getSearchAndFilterObject());
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
    this.el.shadowRoot.getElementById('filter-popup').open();
  };

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
                  value={this.searchText}
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
            <div class="sort-wrap">
              <biggive-form-field-select placeholder="Sort by" id="sort-by">
                <biggive-form-field-select-option value="amountRaised" label="Most raised"></biggive-form-field-select-option>
                <biggive-form-field-select-option value="matchFundsRemaining" label="Match funds remaining"></biggive-form-field-select-option>
              </biggive-form-field-select>
            </div>

            <div class="filter-wrap">
              <biggive-button class="filter" onClick={this.handleFilterButtonClick} label="Filters"></biggive-button>
              <biggive-popup id="filter-popup">
                <h4 class="space-above-0 space-below-3 colour-primary">Filters</h4>
                <biggive-form-field-select placeholder="Category" id="categories" space-below="2">
                  {this.categoryOptions.length === 0
                    ? undefined
                    : this.categoryOptions.map(option => <biggive-form-field-select-option value={option} label={option}></biggive-form-field-select-option>)}
                </biggive-form-field-select>

                <biggive-form-field-select placeholder="Beneficiary" id="beneficiaries" space-below="2">
                  {this.beneficiaryOptions.length === 0
                    ? undefined
                    : this.beneficiaryOptions.map(option => <biggive-form-field-select-option value={option} label={option}></biggive-form-field-select-option>)}
                </biggive-form-field-select>

                <biggive-form-field-select placeholder="Location" id="locations" space-below="2">
                  {this.locationOptions.length === 0
                    ? undefined
                    : this.locationOptions.map(option => <biggive-form-field-select-option value={option} label={option}></biggive-form-field-select-option>)}
                </biggive-form-field-select>

                <biggive-form-field-select placeholder="Funding" id="funding" space-below="2">
                  {this.fundingOptions.length === 0
                    ? undefined
                    : this.fundingOptions.map(option => <biggive-form-field-select-option value={option} label={option}></biggive-form-field-select-option>)}
                </biggive-form-field-select>
                <div class="align-right">
                  <biggive-button label="Apply filters" onClick={this.handleApplyFilterButtonClick} />
                </div>
              </biggive-popup>
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
