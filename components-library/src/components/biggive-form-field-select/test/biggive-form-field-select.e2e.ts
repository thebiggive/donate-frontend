import { newE2EPage } from '@stencil/core/testing';

describe('biggive-form-field-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-form-field-select></biggive-form-field-select>');

    const element = await page.find('biggive-form-field-select');
    expect(element).toHaveClass('hydrated');
  });
});
