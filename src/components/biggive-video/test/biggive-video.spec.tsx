import { newSpecPage } from '@stencil/core/testing';
import { BiggiveVideo } from '../biggive-video';

describe('biggive-video', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveVideo],
      html: `<biggive-video></biggive-video>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-video>
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
      </biggive-video>
    `);
  });
});
