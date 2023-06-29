import { newSpecPage } from '@stencil/core/testing';
import { BiggiveFilteredCarousel } from '../biggive-filtered-carousel';

describe('biggive-filtered-carousel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveFilteredCarousel],
      html: `<biggive-filtered-carousel></biggive-filtered-carousel>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-filtered-carousel>
        <mock:shadow-root>
        <div class="container space-below-4">
          <div class="filters">
            <span class="button clear">
              <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" stroke="#000000" stroke-color="1"></path>
              </svg>
            </span>
          </div>
          <biggive-carousel button-background-colour="white" button-icon-colour="primary" column-count="3" space-below="1"></biggive-carousel>
        </div>
        </mock:shadow-root>
      </biggive-filtered-carousel>
    `);
  });
});
