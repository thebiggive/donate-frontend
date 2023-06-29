import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCarousel } from '../biggive-carousel';

describe('biggive-carousel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCarousel],
      html: `<biggive-carousel></biggive-carousel>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-carousel>
        <mock:shadow-root>
          <div class="button-background-colour-white button-icon-colour-primary column-count-3 container space-below-4">
            <div class="items">
              <div class="sleeve">
                <slot></slot>
              </div>
            </div>
            <div class="navigation">
              <div class="button prev" title="Previous">
                <svg fill="none" height="16" viewBox="0 0 9 16" width="9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2"></path>
                </svg>
              </div>
              <div class="button next" title="Next">
                <svg fill="none" height="16" viewBox="0 0 9 16" width="9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2"></path>
                </svg>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-carousel>
    `);
  });
});
