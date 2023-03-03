import { newSpecPage } from '@stencil/core/testing';
import { BiggiveHeading } from '../biggive-heading';

describe('biggive-heading', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveHeading],
      html: `<biggive-heading></biggive-heading>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-heading>
        <mock:shadow-root>
          <div class="align-left container space-above-2 space-below-4">
            <h1 class="heading-1 heading-colour-primary icon-colour-primary"></h1>
          </div>
        </mock:shadow-root>
      </biggive-heading>
    `);
  });
});
