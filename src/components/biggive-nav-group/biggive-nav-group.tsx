import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-nav-group',
  styleUrl: 'biggive-nav-group.scss',
  shadow: true,
})
export class BiggiveNavGroup {
  /**
   * Inline
   */
  @Prop() inline: boolean = true;

  render() {
    return (
      <ul>
        <slot></slot>
      </ul>
    );
  }
}
