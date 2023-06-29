import { newSpecPage } from '@stencil/core/testing';
import { BiggivePageSection } from '../biggive-page-section';

describe('biggive-page-section', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggivePageSection],
      html: `<biggive-page-section max-width=100 space-after=4 colour-scheme="primary" sectionStyleTop="straight" sectionStyleBottom="straight"></biggive-section>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-page-section max-width="100" colour-scheme="primary" sectionstylebottom="straight" sectionstyletop="straight" space-after="4">
        <mock:shadow-root>
          <div class="background-color-primary container max-width-100 space-below-0 style-bottom-straight style-top-straight">
            <div class="sleeve">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-page-section>
    `);
  });
});
