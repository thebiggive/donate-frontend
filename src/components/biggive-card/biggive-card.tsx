import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-card',
  styleUrl: 'biggive-card.css',
  shadow: true,
})
export class BiggiveCard {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
