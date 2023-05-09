import { newE2EPage } from '@stencil/core/testing';
describe('biggive-text-input', () => {
    it('renders', async () => {
        const page = await newE2EPage();
        await page.setContent('<biggive-text-input></biggive-text-input>');
        const element = await page.find('biggive-text-input');
        expect(element).toHaveClass('hydrated');
    });
});
