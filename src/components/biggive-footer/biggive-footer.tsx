import {Component, Element, getAssetPath, h} from '@stencil/core';

@Component({
  tag: 'biggive-footer',
  styleUrl: 'biggive-footer.scss',
  shadow: true,
})
export class BiggiveFooter {
  @Element() host: HTMLBiggiveFooterElement;

  getMenuUlContents(slotName: string) {
    const navItems = [];
    const node = this.host.querySelector(`[slot="${slotName}"]`);
    if (node != null) {
      node.querySelectorAll('li').forEach(el => {
        navItems.push(
          <li>
            <a href={el.firstElementChild.getAttribute('href')}>{el.innerText}</a>
          </li>,
        );
      });
    }

    return navItems;
  }

  render() {
    const navPrimary = this.getMenuUlContents('nav-primary');
    const navSecondary = this.getMenuUlContents('nav-secondary');
    const navTertiary = this.getMenuUlContents('nav-tertiary');
    const navPostscript = this.getMenuUlContents('nav-postscript');

    return (
      <footer class="footer">
        <div class="row row-top">
          <nav class="nav nav-primary">
            <h5>
              <slot name="nav-primary-title"></slot>
            </h5>
            <ul>{navPrimary}</ul>
          </nav>

          <nav class="nav nav-secondary">
            <h5>
              <slot name="nav-secondary-title"></slot>
            </h5>
            <ul>{navSecondary}</ul>
          </nav>

          <nav class="nav nav-tertiary">
            <h5>
              <slot name="nav-tertiary-title"></slot>
            </h5>
            <ul>{navTertiary}</ul>
          </nav>

          <div class="button-wrap">
            <biggive-button colour-scheme="white" url="#" label="For charities"></biggive-button>
            <biggive-button colour-scheme="white" url="#" label="For funders"></biggive-button>
          </div>
        </div>

        <div class="row row-bottom">
          <div class="postscript-wrap">
            <img class="fr-logo" src={getAssetPath('../assets/images/fundraising-regulator.png')} />

            <nav class="nav nav-postscript">
              <ul>{navPostscript}</ul>
            </nav>
          </div>

          <div class="social-icon-wrap">
            <slot name="social-icons"></slot>
          </div>
          <p>&copy; 2007 – 2022 The Big Give Trust (1136547) | Company number 07273065 | Dragon Court, 27-29 Macklin Street, London WC2B 5LX, United Kingdom</p>
        </div>
      </footer>
    );
  }
}
