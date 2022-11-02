import { newSpecPage } from '@stencil/core/testing';
import { BiggivePopup } from '../biggive-popup';

describe('biggive-popup', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggivePopup],
      html: `<biggive-popup></biggive-popup>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-popup>
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
      </biggive-popup>
    `);
  });
});
