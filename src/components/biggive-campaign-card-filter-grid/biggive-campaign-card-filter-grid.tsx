import { Component, h, Element, Prop, State } from '@stencil/core';
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';

@Component({
  tag: 'biggive-campaign-card-filter-grid',
  styleUrl: 'biggive-campaign-card-filter-grid.scss',
  shadow: true,
})
export class BiggiveCampaignCardFilterGrid {
  @Element() el;

  @State() searchText: string = null;

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

  private handleSearchTextChanged(event) {
    this.searchText = event.target.value;
  }

  private handleSearchButtonPressed() {
    //this.doSearch.emit(this.searchText);
  }

  private handleEnterPressed(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      //this.doSearch.emit(this.searchText);
    }
  }

  private handleFilterButtonClick() {
    this.el.shadowRoot.getElementById('filter-popup').open();

    var filters = { categories: [], beneficiaries: [] };
    var cards = this.el.querySelectorAll('biggive-campaign-card');

    for (var i = 0; i < cards.length; i++) {
      var categories = JSON.parse(cards[i].getAttribute('data-filter-categories'));
      for (var p in categories) {
        if (!filters.categories.includes(categories[p])) {
          filters.categories.push(categories[p]);
        }
      }
      var beneficiaries = JSON.parse(cards[i].getAttribute('data-filter-beneficiaries'));
      for (var p in beneficiaries) {
        if (!filters.beneficiaries.includes(beneficiaries[p])) {
          filters.beneficiaries.push(beneficiaries[p]);
        }
      }
    }

    categories.sort();
    this.el.shadowRoot.getElementById('categories').innerHTML = '';
    for (var i = 0; i < filters.categories.length; i++) {
      this.el.shadowRoot.getElementById('categories').innerHTML +=
        '<biggive-form-field-select-option value="' + filters.categories[i] + '" label="' + filters.categories[i] + '"></biggive-form-field-select-option>';
    }

    beneficiaries.sort();
    this.el.shadowRoot.getElementById('beneficiaries').innerHTML = '';
    for (var i = 0; i < filters.beneficiaries.length; i++) {
      this.el.shadowRoot.getElementById('beneficiaries').innerHTML +=
        '<biggive-form-field-select-option value="' + filters.beneficiaries[i] + '" label="' + filters.beneficiaries[i] + '"></biggive-form-field-select-option>';
    }
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
                  value={this.searchText}
                  class="input-text"
                  placeholder={this.placeholderText}
                  onInput={event => this.handleSearchTextChanged(event)}
                  onKeyDown={event => this.handleEnterPressed(event)}
                />
              </div>
              <button onClick={() => this.handleSearchButtonPressed()} class="button button-primary">
                {this.buttonText}
              </button>
            </div>
          </div>
          <div class="sort-filter-wrap">
            <div class="sort-wrap">
              <biggive-form-field-select placeholder="Sort by">
                <biggive-form-field-select-option value="name" label="Name"></biggive-form-field-select-option>
              </biggive-form-field-select>
            </div>

            <div class="filter-wrap">
              <div class="button button-primary filter" onClick={() => this.handleFilterButtonClick()}>
                <span class="filter-icon">
                  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.12042 0.76576C0.327224 0.298 0.766961 0 1.25014 0H14.7517C15.2361 0 15.6736 0.298 15.8799 0.76576C16.0893 1.23352 16.0237 1.787 15.6924 2.18745L10.0011 9.67328V13.929C10.0011 14.3341 9.7886 14.7058 9.44793 14.8866C9.1104 15.0674 8.7041 15.0306 8.40094 14.7862L6.40072 13.179C6.14756 12.9781 6.00067 12.66 6.00067 12.3218V9.67328L0.282594 2.18745C-0.023284 1.787 -0.0864161 1.23352 0.120451 0.76576H0.12042Z"
                      fill="white"
                    />
                  </svg>
                </span>
                Filters
              </div>
              <biggive-popup id="filter-popup">
                <h4 class="space-above-0 space-below-3 colour-primary">Filters</h4>
                <biggive-form-field-select placeholder="Category" id="categories" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select placeholder="Beneficiary" id="beneficiaries" space-below="2"></biggive-form-field-select>
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
