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
          <slot></slot>
        </mock:shadow-root>
      </biggive-carousel>
    `);
  });
});
