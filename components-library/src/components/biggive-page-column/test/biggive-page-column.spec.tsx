import { newSpecPage } from '@stencil/core/testing';
import { BiggivePageColumn } from '../biggive-page-column';

describe('biggive-page-column', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggivePageColumn],
      html: `<biggive-page-column></biggive-page-column>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-page-column>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-page-column>
    `);
  });
});
