import { newSpecPage } from '@stencil/core/testing';
import { BiggiveGrid } from '../biggive-grid';

describe('biggive-grid', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveGrid],
      html: `<biggive-grid column-count=3 column-gap=3></biggive-grid>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-grid column-count=3 column-gap=3>
        <mock:shadow-root>
        <div class="column-count-3 column-gap-3 grid space-below-4">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </biggive-grid>
    `);
  });
});
