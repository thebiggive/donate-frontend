import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'bigive-button',
  styleUrl: 'bigive-button.css',
  shadow: true,
})
export class BigiveButton {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
