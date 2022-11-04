import { newSpecPage } from '@stencil/core/testing';
import { BiggiveNavGroup } from '../biggive-nav-group';

describe('biggive-nav-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveNavGroup],
      html: `<biggive-nav-group></biggive-nav-group>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-nav-group>
        <mock:shadow-root>
          <ul>
            <slot></slot>
          </ul>
        </mock:shadow-root>
      </biggive-nav-group>
    `);
  });
});
