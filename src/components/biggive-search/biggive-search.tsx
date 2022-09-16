import { Component, h } from '@stencil/core';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  tag: 'biggive-search',
  styleUrl: 'biggive-search.scss',
  shadow: true,
})
export class BigGiveSearch {
  private searchText: string;

  handleSearchTextChanged(event) {
    this.searchText = event.target.value;
  }

  search() {
    console.log(this.searchText);
  }

  handleEnterPressed(ev: KeyboardEvent){
    if (ev.key === 'Enter'){
      this.search();
    }
  }

  render() {
    return (
      <div class="container">
        <h2>Find a Charity</h2>

        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
            <path d={faMagnifyingGlass.icon[4].toString()} />
          </svg>

          <input type="text" placeholder="Search" onInput={(event) => this.handleSearchTextChanged(event)} onKeyDown={(event) => this.handleEnterPressed(event)}/>

          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
            <path d={faX.icon[4].toString()} />
          </svg>
        </div>

        <button onClick={() => this.search()}>Search</button>
      </div>
    );
  }
}
