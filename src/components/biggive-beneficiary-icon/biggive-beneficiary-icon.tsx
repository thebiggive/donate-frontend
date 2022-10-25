import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-beneficiary-icon',
  styleUrl: 'biggive-beneficiary-icon.scss',
  shadow: true,
})
export class BiggiveBeneficiaryIcon {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
