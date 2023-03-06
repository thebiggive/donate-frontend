import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-tab',
  styleUrl: 'biggive-tab.scss',
  shadow: true,
})
export class BiggiveTab {
  @Prop() tabTitle: string = '';

  render() {
    return (
      <div class="container">
        <slot></slot>
      </div>
    );
  }
}
