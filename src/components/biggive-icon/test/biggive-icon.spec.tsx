import { newSpecPage } from '@stencil/core/testing';
import { BiggiveIcon } from '../biggive-icon';

describe('biggive-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveIcon],
      html: `<biggive-icon></biggive-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-icon>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-icon>
    `);
  });
});
