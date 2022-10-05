import { Component, Element, h } from '@stencil/core';

@Component({
  tag: 'biggive-header',
  styleUrl: 'biggive-header.scss',
  shadow: true,
})
export class BiggiveHeader {

  @Element() host: HTMLBiggiveHeaderElement;

  render() {

    var node = null;
    var navPrimary = null;
    var navSecondary = null;

    node = this.host.querySelector('[slot="nav-primary"]');
    if (node != null) {
      navPrimary = [];
      node.querySelectorAll('li').forEach(el => {
        navPrimary.push(
        <li>
          <a href="#">{el.innerText}</a>
        </li>
        )
      });
    }

    node = this.host.querySelector('[slot="nav-secondary"]');
    if (node != null) {
      navSecondary = [];
      node.querySelectorAll('li').forEach(el => {
        navSecondary.push(
        <li>
          <a href="#">{el.innerText}</a>
        </li>
        )
      });
    }


    return (
      <header class="header">
        <div class="row row-top">
          <div class="social-icon-wrap">
            <biggive-social-icon service="Facebook" url="https://www.facebook.com"></biggive-social-icon>
            <biggive-social-icon service="Twitter" url="https://www.twitter.com"></biggive-social-icon>
            <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com"></biggive-social-icon>
            <biggive-social-icon service="YouTube" url="https://www.youtube.com"></biggive-social-icon>
            <biggive-social-icon service="Instagram" url="https://www.instagram.com"></biggive-social-icon>
          </div>
          <nav class="nav nav-secondary"><ul>{navSecondary}</ul></nav>
        </div>
        <div class="row row-bottom">
          <div class="logo-wrap"></div>
          <nav class="nav nav-primary"><ul>{navPrimary}</ul></nav>
        </div>
      </header>
    );
  }
}
