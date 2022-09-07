import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-search',
  styleUrl: 'biggive-search.scss',
  shadow: true,
})
export class BigGiveSearch {
  render() {
    return (
      <div class="container">
        <h2>FIND A CHARITY</h2>
        <input type="text" placeholder='Search' />
        <button>CHOOSE THESE FILTERS</button>
      </div>
    );
  }
}
