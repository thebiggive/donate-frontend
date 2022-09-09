import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-search',
  styleUrl: 'biggive-search.scss',
  shadow: false,
})
export class BigGiveSearch {
  render() {
    return (
      <div class="container">
        <h2>Find a Charity</h2>
        <input type="text" placeholder='Search'/>
        <button>Search</button>
      </div>
    );
  }
}
