import { newSpecPage } from '@stencil/core/testing';
import { BiggiveFormFieldSelect } from '../biggive-form-field-select';

describe('biggive-form-field-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveFormFieldSelect],
      html: `<biggive-form-field-select prompt="What would you like?" options='{"optionOne": "Option one", "optionTwo": "Option two"}'></biggive-form-field-select>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-form-field-select options="{&quot;optionOne&quot;: &quot;Option one&quot;, &quot;optionTwo&quot;: &quot;Option two&quot;}" prompt="What would you like?">
        <mock:shadow-root>
          <div class="selectWrapper">
            <label>
              <div class="prompt">What would you like?</div>
              <div class="dropdown select-style-bordered space-below-0">
                <div class="sleeve">
                  <select>
                    <option value="optionOne">
                      Option one
                    </option>
                    <option value="optionTwo">
                      Option two
                    </option>
                  </select>
                  <div class="arrow"></div>
                </div>
              </div>
            </label>
          </div>
        </mock:shadow-root>
      </biggive-form-field-select>
  `);
  });
});
