import { newSpecPage } from '@stencil/core/testing';
import { BiggiveAccordion } from '../biggive-accordion';

describe('biggive-accordion', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveAccordion],
      html: `<biggive-accordion></biggive-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-accordion>
        <mock:shadow-root>
          <div class="container heading-colour-primary space-below-0 text-colour-black">
            <div class="sleeve"></div>
          </div>
        </mock:shadow-root>
      </biggive-accordion>
    `);
  });
});
