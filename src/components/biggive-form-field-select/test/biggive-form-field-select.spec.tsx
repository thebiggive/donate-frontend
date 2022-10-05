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
          <slot></slot>
        </mock:shadow-root>
      </biggive-form-field-select>
    `);
  });
});
