import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-video',
  styleUrl: 'biggive-video.css',
  shadow: true,
})
export class BiggiveVideo {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
