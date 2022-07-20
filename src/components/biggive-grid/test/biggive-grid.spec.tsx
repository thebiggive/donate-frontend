import { newSpecPage } from '@stencil/core/testing';
import { BiggiveGrid } from '../biggive-grid';

describe('biggive-grid', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveGrid],
      html: `<biggive-grid></biggive-grid>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-grid>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-grid>
    `);
  });
});
