import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-breadcrumbs',
  styleUrl: 'biggive-breadcrumbs.css',
  shadow: true,
})
export class BiggiveBreadcrumbs {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
