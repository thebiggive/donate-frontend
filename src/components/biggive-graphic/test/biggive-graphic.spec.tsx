import { newSpecPage } from '@stencil/core/testing';
import { BiggiveGraphic } from '../biggive-graphic';

describe('biggive-graphic', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveGraphic],
      html: `<biggive-graphic></biggive-graphic>`,
    });
    expect(page.root).toEqualHtml(`
    <biggive-graphic>
      <mock:shadow-root>
        <div class="colour-scheme-primary container">
          <div class="sleeve">
            <div class="content-wrap">
              <div class="slug text-colour-"></div>
              <h2 class="text-colour- title"></h2>
              <div class="teaser text-colour-"></div>
            </div>
            <div class="graphic-wrap"></div>
          </div>
        </div>
      </mock:shadow-root>
    </biggive-graphic>
    `);
  });
});
