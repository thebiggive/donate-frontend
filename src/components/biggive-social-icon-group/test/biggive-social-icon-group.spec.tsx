import { newSpecPage } from '@stencil/core/testing';
import { BiggiveSocialIconGroup } from '../biggive-social-icon-group';

describe('biggive-social-icon-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveSocialIconGroup],
      html: `<biggive-social-icon-group></biggive-social-icon-group>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-social-icon-group>
        <mock:shadow-root>
          <div class="container space-below-0">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </biggive-social-icon-group>
    `);
  });
});
