import { Component, h } from '@stencil/core';

@Component({
  tag: 'biggive-page-column',
  styleUrl: 'biggive-page-column.scss',
  shadow: true,
})
export class BiggivePageColumn {
  render() {
    return <slot></slot>;
  }
}
