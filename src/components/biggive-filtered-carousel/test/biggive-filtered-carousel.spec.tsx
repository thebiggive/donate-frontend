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
          <div class="filters"></div>
          <biggive-carousel button-background-colour="white" button-icon-colour="primary" column-count="3" space-below="0"></biggive-carousel>
        </div>
        </mock:shadow-root>
      </biggive-filtered-carousel>
    `);
  });
});
