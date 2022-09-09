import { Component, h } from '@stencil/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  tag: 'biggive-search',
  styleUrl: 'biggive-search.scss',
  shadow: true,
})
export class BigGiveSearch {
  render() {
    return (
      <div class="container">
        <h2>Find a Charity</h2>

        <div class="search-box">
          <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
            <path d={faMagnifyingGlass.icon[4].toString()} />
          </svg>

          <input type="text" placeholder="Search" />

          <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
            <path d={faX.icon[4].toString()} />
          </svg>
        </div>


        <button>Search</button>
      </div>
    );
  }
}
