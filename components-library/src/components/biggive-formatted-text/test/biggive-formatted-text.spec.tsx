import { newSpecPage } from '@stencil/core/testing';
import { BiggiveFormattedText } from '../biggive-formatted-text';

describe('biggive-formatted-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveFormattedText],
      html: `<biggive-formatted-text></biggive-formatted-text>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-formatted-text>
        <mock:shadow-root>
          <div class="container max-width-100 space-below-0 text-colour-primary">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </biggive-formatted-text>
    `);
  });
});
