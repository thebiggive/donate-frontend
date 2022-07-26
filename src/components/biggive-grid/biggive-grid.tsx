import { Component, h } from '@stencil/core';

@Component({
  tag: 'biggive-grid',
  styleUrl: 'biggive-grid.css',
  shadow: true,
})
export class BiggiveGrid {
  render() {
    return (
      <div class="grid">
        <slot></slot>
      </div>
    );
  }
}
