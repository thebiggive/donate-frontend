import { Component, Host, Element, h } from '@stencil/core';

@Component({
  tag: 'biggive-footer',
  styleUrl: 'biggive-footer.scss',
  shadow: true,
})
export class BiggiveFooter {

  @Element() host: HTMLBiggiveFooterElement;

  render() {

    var node = null;
    var navPrimary = null;
    var navSecondary = null;
    var navTertiary = null;

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

    node = this.host.querySelector('[slot="nav-tertiary"]');
    if (node != null) {
      navTertiary = [];
      node.querySelectorAll('li').forEach(el => {
        navTertiary.push(
        <li>
          <a href="#">{el.innerText}</a>
        </li>
        )
      });
    }


    return (
      <footer class="footer">
        <div class="row row-top">

          <nav class="nav nav-primary">
            <h5><slot name="nav-primary-title"></slot></h5>
            <ul>{navPrimary}</ul>
          </nav>

          <nav class="nav nav-secondary">
            <h5><slot name="nav-secondary-title"></slot></h5>
            <ul>{navSecondary}</ul>
          </nav>

          <nav class="nav nav-tertiary">
            <h5><slot name="nav-tertiary-title"></slot></h5>
            <ul>{navTertiary}</ul>
          </nav>


          <div class="button-wrap">
            <biggive-button colour-scheme="white" url="#" label="Donor login"></biggive-button>
            <biggive-button colour-scheme="white" url="#" label="For charities"></biggive-button>
            <biggive-button colour-scheme="white" url="#" label="For funders"></biggive-button>
          </div>
        </div>

        <div class="row row-bottom">
          <div class="social-icon-wrap">
            <biggive-social-icon service="Facebook" url="https://www.facebook.com"></biggive-social-icon>
            <biggive-social-icon service="Twitter" url="https://www.twitter.com"></biggive-social-icon>
            <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com"></biggive-social-icon>
            <biggive-social-icon service="YouTube" url="https://www.youtube.com"></biggive-social-icon>
            <biggive-social-icon service="Instagram" url="https://www.instagram.com"></biggive-social-icon>
          </div>
          <p>&copy; 2007 – 2022 The Big Give Trust (1136547) | Company number 07273065  | Dragon Court, 27-29 Macklin Street, London WC2B 5LX, United Kingdom</p>
        </div>

      </footer>
    );
  }

}
