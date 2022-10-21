import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTabbedContent } from '../biggive-tabbed-content';

describe('biggive-tabbed-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTabbedContent],
      html: `<biggive-tabbed-content></biggive-tabbed-content>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-tabbed-content>
        <mock:shadow-root>
          <div class="container default-text-colour-black space-below-0">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </biggive-tabbed-content>
    `);
  });
});
