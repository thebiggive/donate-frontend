import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTotalizerTickerItem } from '../biggive-totalizer-ticker-item';

describe('biggive-totalizer-ticker-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTotalizerTickerItem],
      html: `<biggive-totalizer-ticker-item></biggive-totalizer-ticker-item>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-totalizer-ticker-item>
        <mock:shadow-root>
          <div class="ticker-item">
            <strong></strong>
          </div>
        </mock:shadow-root>
      </biggive-totalizer-ticker-item>
    `);
  });
});
