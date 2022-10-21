import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-tab',
  styleUrl: 'biggive-tab.scss',
  shadow: true,
})
export class BiggiveTab {
  /**
   * Title
   */
  @Prop() tabTitle: string = '';

  render() {
    return (
      <div class="container">
        <div class="title">{this.tabTitle}</div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    );
  }
}
