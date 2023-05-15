import { newSpecPage } from '@stencil/core/testing';
import { BiggiveFormFieldSelect } from '../biggive-form-field-select';

describe('biggive-form-field-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveFormFieldSelect],
      html: `<biggive-form-field-select></biggive-form-field-select>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-form-field-select>
        <mock:shadow-root>
          <div class="dropdown select-style-bordered space-below-0">
            <div class="sleeve">
              <span class="placeholder"></span>
            </div>
            <div class="options">
              <slot></slot>
            </div>
            <div class="prompt"></div>
          </div>
        </mock:shadow-root>
      </biggive-form-field-select>
    `);
  });
});
