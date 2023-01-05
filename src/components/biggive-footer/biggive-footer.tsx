import { Component, Element, getAssetPath, h } from '@stencil/core';

@Component({
  tag: 'biggive-footer',
  styleUrl: 'biggive-footer.scss',
  shadow: true,
})
export class BiggiveFooter {
  @Element() host: HTMLBiggiveFooterElement;

  appendMenu(menuName: string) {
    var node = this.host.querySelector(`[slot="${menuName}"]`);
    if (node !== null) {
      this.host!.shadowRoot!.querySelector(`.${menuName}`)!.appendChild(node);
    }
  }

  componentDidRender() {
    this.appendMenu('nav-primary');
    this.appendMenu('nav-secondary');
    this.appendMenu('nav-tertiary');
    this.appendMenu('nav-postscript');
  }

  render() {
    return (
      <footer class="footer">
        <div class="row row-top">
          <nav class="nav nav-primary">
            <h5>
              <slot name="nav-primary-title"></slot>
            </h5>
          </nav>

          <nav class="nav nav-secondary">
            <h5>
              <slot name="nav-secondary-title"></slot>
            </h5>
          </nav>

          <nav class="nav nav-tertiary">
            <h5>
              <slot name="nav-tertiary-title"></slot>
            </h5>
          </nav>

          <div class="button-wrap">
            <biggive-button colour-scheme="white" url="https://blog.thebiggive.org.uk/charities" label="For charities"></biggive-button>
            <biggive-button colour-scheme="white" url="https://blog.thebiggive.org.uk/funders" label="For funders"></biggive-button>
          </div>
        </div>

        <div class="row row-bottom">
          <div class="postscript-wrap">
            <img class="fr-logo" src={getAssetPath('../assets/images/fundraising-regulator.png')} alt="Fundraising Regulator" />

            <nav class="nav nav-postscript"></nav>
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
