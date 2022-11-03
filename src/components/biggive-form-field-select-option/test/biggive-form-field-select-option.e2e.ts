import { newE2EPage } from '@stencil/core/testing';

describe('biggive-form-field-select-option', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-form-field-select-option></biggive-form-field-select-option>');

    const element = await page.find('biggive-form-field-select-option');
    expect(element).toHaveClass('hydrated');
  });
});
