import { newSpecPage } from '@stencil/core/testing';
import { BiggiveProgressBar } from '../biggive-progress-bar';

describe('biggive-progress-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveProgressBar],
      html: `<biggive-progress-bar colour-scheme="primary" counter="100"></biggive-progress-bar>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-progress-bar colour-scheme="primary" counter="100">
        <mock:shadow-root>
          <div class="progress-bar progress-bar-primary space-below-0">
            <div class="slider">
              <div class="progress" style="width: 100%;"></div>
            </div>
            <div class="counter">
              100%
            </div>
          </div>
        </mock:shadow-root>
      </biggive-progress-bar>
    `);
  });
});
