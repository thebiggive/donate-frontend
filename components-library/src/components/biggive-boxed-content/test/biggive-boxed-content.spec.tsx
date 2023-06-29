import { newSpecPage } from '@stencil/core/testing';
import { BiggiveBoxedContent } from '../biggive-boxed-content';

describe('biggive-boxed-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveBoxedContent],
      html: `<biggive-boxed-content></biggive-boxed-content>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-boxed-content>
        <mock:shadow-root>
          <div class="background-colour-white container horizontal-padding-3 shadow-true space-below-0 vertical-padding-3">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </biggive-boxed-content>
    `);
  });
});
