import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-text-input',
  styleUrl: 'biggive-text-input.css',
  shadow: true,
})
export class BiggiveTextInput {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
