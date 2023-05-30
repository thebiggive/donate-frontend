import { newSpecPage } from '@stencil/core/testing';
import { BiggiveFooter } from '../biggive-footer';

describe('biggive-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveFooter],
      html: `<biggive-footer></biggive-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-footer>
        <mock:shadow-root>
        <footer class="footer">
        <div class="row row-top">

          <nav class="nav nav-primary" aria-labelledby="footer-primary-heading">
            <h5 class="heading" id="footer-primary-heading"><slot name="nav-primary-title"></slot></h5>
          </nav>

          <nav class="nav nav-secondary" aria-labelledby="footer-secondary-heading-heading">
            <h5 class="heading" id="footer-secondary-heading"><slot name="nav-secondary-title"></slot></h5>
          </nav>

          <nav class="nav nav-tertiary" aria-labelledby="footer-tertiary-heading">
            <h5 class="heading" id="footer-tertiary-heading"><slot name="nav-tertiary-title"></slot></h5>
          </nav>


          <div class="button-wrap">
            <biggive-button colour-scheme="white" url="https://blog.thebiggive.org.uk/charities" label="For charities"></biggive-button>
            <biggive-button colour-scheme="white" url="https://blog.thebiggive.org.uk/funders" label="For funders"></biggive-button>
          </div>
        </div>

        <div class="row row-bottom">
          <div class="postscript-wrap">
            <img class="fr-logo" src="/assets/images/fundraising-regulator.png" alt="Fundraising Regulator">
            <nav class="nav nav-postscript" aria-label="Legal"></nav>
          </div>
          <div class="social-icon-wrap">
            <slot name="social-icons"></slot>
          </div>
          <p>&copy; 2007 – 2023 The Big Give Trust (1136547) | Company number 07273065  | Dragon Court, 27-29 Macklin Street, London WC2B 5LX, United Kingdom</p>
        </div>

      </footer>
        </mock:shadow-root>
      </biggive-footer>
    `);
  });
});
