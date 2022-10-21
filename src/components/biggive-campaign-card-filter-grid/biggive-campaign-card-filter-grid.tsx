import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';

@Component({
  tag: 'biggive-campaign-card-filter-grid',
  styleUrl: 'biggive-campaign-card-filter-grid.scss',
  shadow: true,
})
export class BiggiveCampaignCardFilterGrid {
  /**
   * This event `doTextSearch` event is emitted and propogates to the parent
   * component which handles it
   */
  @Event({
    eventName: 'doTextSearch',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doSearch: EventEmitter<string>;

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
    this.doSearch.emit(this.searchText);
  }

  private handleEnterPressed(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      this.doSearch.emit(this.searchText);
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
          <div class="filter-wrap"></div>
          <div class="campaign-grid">
            <slot name="campaign-grid"></slot>
          </div>
        </div>
      </div>
    );
  }
}
