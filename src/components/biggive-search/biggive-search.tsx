import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { faMagnifyingGlass, faX } from '@fortawesome/pro-solid-svg-icons';

@Component({
  tag: 'biggive-search',
  styleUrl: 'biggive-search.scss',
  shadow: true,
})
export class BigGiveSearch {
  /**
   * This event `doSearch` event is emitted and propogates to the parent
   * component which handles it
   */
  @Event({
    eventName: 'doSearch',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doSearch: EventEmitter<string>;

  @State() searchText: string = null;

  private handleSearchTextChanged(event) {
    this.searchText = event.target.value;
  }

  /**
   * Defines the text displayed as the placeholder in the input field
   * before the user types anything
   */
  @Prop() placeholderText: string;

  /**
   * Defines the text on the search button
   */
  @Prop() buttonText: string;

  private handleSearchButtonPressed() {
    this.doSearch.emit(this.searchText);
  }

  private handleEnterPressed(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      this.doSearch.emit(this.searchText);
    }
  }

  clearSearchText = () => {
    this.searchText = '';
  };

  render() {
    return (
      <div class="padding-enclosure">
        <div class="outer-container">
          <div class="triangle triangle-before"></div>
          <div class="inner-container">
            <h2>Find a charity or project</h2>

            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                <path d={faMagnifyingGlass.icon[4].toString()} />
              </svg>

              <input
                type="text"
                value={this.searchText}
                placeholder={this.placeholderText}
                onInput={event => this.handleSearchTextChanged(event)}
                onKeyDown={event => this.handleEnterPressed(event)}
              />

              <svg xmlns="http://www.w3.org/2000/svg" class="icon" id="x-icon" viewBox="0 0 512 512" onClick={() => this.clearSearchText()}>
                <path d={faX.icon[4].toString()} />
              </svg>
            </div>

            <biggive-button label={this.buttonText} onClick={() => this.handleSearchButtonPressed()} />
          </div>
          <div class="triangle triangle-after"></div>
        </div>
      </div>
    );
  }
}
