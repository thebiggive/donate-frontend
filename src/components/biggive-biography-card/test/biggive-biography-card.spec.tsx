import { newSpecPage } from '@stencil/core/testing';
import { BiggiveBiographyCard } from '../biggive-biography-card';

describe('biggive-biography-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveBiographyCard],
      html: `<biggive-biography-card></biggive-biography-card>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-biography-card>
        <mock:shadow-root>
          <div class="background-colour-white container space-below-0 text-align-left text-colour-black">
            <h3 class="full-name"></h3>
            <div class="job-title"></div>
          </div>
        </mock:shadow-root>
      </biggive-biography-card>
    `);
  });
});
