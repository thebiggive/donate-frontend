import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-carousel',
  styleUrl: 'biggive-carousel.scss',
  shadow: true,
})
export class BiggiveCarousel {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
