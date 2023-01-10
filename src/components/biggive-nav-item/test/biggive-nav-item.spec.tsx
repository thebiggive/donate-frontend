import { newSpecPage } from '@stencil/core/testing';
import { BiggiveNavItem } from '../biggive-nav-item';

describe('biggive-nav-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveNavItem],
      html: `<biggive-nav-item></biggive-nav-item>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-nav-item>
        <mock:shadow-root>
          <li class="icon-undefined">
            <a></a>
            <slot></slot>
          </li>
        </mock:shadow-root>
      </biggive-nav-item>
    `);
  });
});
