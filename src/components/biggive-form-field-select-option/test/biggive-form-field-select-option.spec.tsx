import { newSpecPage } from '@stencil/core/testing';
import { BiggiveFormFieldSelectOption } from '../biggive-form-field-select-option';

describe('biggive-form-field-select-option', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveFormFieldSelectOption],
      html: `<biggive-form-field-select-option></biggive-form-field-select-option>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-form-field-select-option>
        <mock:shadow-root>
          <div class="option"></div>
        </mock:shadow-root>
      </biggive-form-field-select-option>
    `);
  });
});
