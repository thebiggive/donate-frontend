import { newSpecPage } from '@stencil/core/testing';
import { BiggivePopupStandalone } from '../biggive-popup-standalone';

describe('biggive-popup-standalone', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggivePopupStandalone],
      html: `<biggive-popup-standalone></biggive-popup-standalone>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-popup-standalone>
        <mock:shadow-root>
          <div class="popup">
            <div class="sleeve">
              <div class="header">
                <div class="close"></div>
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-popup-standalone>
    `);
  });
});
