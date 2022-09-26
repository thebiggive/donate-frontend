import { newSpecPage } from '@stencil/core/testing';
import { BiggiveDropdown } from '../biggive-dropdown';

describe('biggive-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveDropdown],
      html: `<biggive-dropdown></biggive-dropdown>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-dropdown>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-dropdown>
    `);
  });
});
