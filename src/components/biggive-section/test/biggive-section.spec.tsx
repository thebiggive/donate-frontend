import { newSpecPage } from '@stencil/core/testing';
import { BiggiveSection } from '../biggive-section';

describe('biggive-section', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveSection],
      html: `<biggive-section space-after=4 colour-scheme="primary" sectionStyleTop="straight" sectionStyleBottom="straight"></biggive-section>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-section colour-scheme="primary" sectionstylebottom="straight" sectionstyletop="straight" space-after="4">
        <mock:shadow-root>
          <div class="background-color-primary container space-after-4 style-bottom-straight style-top-straight">
            <div class="sleeve">
              <slot name="children"></slot>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-section>
    `);
  });
});
