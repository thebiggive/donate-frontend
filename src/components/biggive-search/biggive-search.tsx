import { Component, h, Prop, State } from '@stencil/core';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  tag: 'biggive-search',
  styleUrl: 'biggive-search.scss',
  shadow: true,
})
export class BigGiveSearch {
  @State() searchText: string = null;

  private handleSearchTextChanged(event) {
    this.searchText = event.target.value;
  }

  /**
   * This prop points to the memory address of the *real* search function
   * on the parent of this component.
   */ 
  @Prop() doSearch: Function;

  @Prop() placeholderText: string;

  @Prop() buttonText: string;

  private handleSearchButtonPressed() {
    this.doSearch(this.searchText);
  }

  private handleEnterPressed(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      this.doSearch(this.searchText);
    }
  }

  clearSearchText = () => {
    this.searchText = '';
  }

  render() {
    return (
      <div class="container">
        <h2>Find a Charity</h2>

        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
            <path d={faMagnifyingGlass.icon[4].toString()} />
          </svg>

          <input type="text" placeholder={this.placeholderText} onInput={event => this.handleSearchTextChanged(event)} onKeyDown={event => this.handleEnterPressed(event)} />

          <svg xmlns="http://www.w3.org/2000/svg" class="icon" id="x-icon" viewBox="0 0 512 512" onClick={() => this.clearSearchText()}>
            <path d={faX.icon[4].toString()} />
          </svg>
        </div>

        <button onClick={() => this.handleSearchButtonPressed()}>{this.buttonText}</button>
      </div>
    );
  }
}
