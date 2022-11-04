import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-nav-item',
  styleUrl: 'biggive-nav-item.scss',
  shadow: true,
})
export class BiggiveNavItem {
  /**
   * URL
   */
  @Prop() url: string = null;
  /**
   * Label
   */
  @Prop() label: string = null;
  /**
   * URL
   */
  @Prop() iconColour: string = null;

  render() {
    return (
      <li class={'icon-' + this.iconColour}>
        <a href={this.url}>{this.label}</a>
        <slot></slot>
      </li>
    );
  }
}
