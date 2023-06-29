import { newSpecPage } from '@stencil/core/testing';
import { BiggiveIconGroup } from '../biggive-icon-group';

describe('biggive-social-icon-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveIconGroup],
      html: `<biggive-icon-group></biggive-icon-group>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-icon-group>
        <mock:shadow-root>
          <div class="container space-below-0">
            <div class="sleeve">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-icon-group>
    `);
  });
});
