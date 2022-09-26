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
          <slot></slot>
        </mock:shadow-root>
      </biggive-footer>
    `);
  });
});
