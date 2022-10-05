import { newSpecPage } from '@stencil/core/testing';
import { BiggiveHeader } from '../biggive-header';

describe('biggive-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveHeader],
      html: `<biggive-header></biggive-header>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-header>
        <mock:shadow-root>
          <header class="header">
            <div class="row row-top">
              <div class="social-icon-wrap">
                <biggive-social-icon service="Facebook" url="https://www.facebook.com"></biggive-social-icon>
                <biggive-social-icon service="Twitter" url="https://www.twitter.com"></biggive-social-icon>
                <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com"></biggive-social-icon>
                <biggive-social-icon service="YouTube" url="https://www.youtube.com"></biggive-social-icon>
                <biggive-social-icon service="Instagram" url="https://www.instagram.com"></biggive-social-icon>
              </div>
              <nav class="nav nav-secondary"><ul></ul></nav>
            </div>
            <div class="row row-bottom">
              <div class="logo-wrap"></div>
              <nav class="nav nav-primary"><ul></ul></nav>
            </div>
          </header>
        </mock:shadow-root>
      </biggive-header>
    `);
  });
});
