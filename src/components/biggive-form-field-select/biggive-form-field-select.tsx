import { Component, Prop, h, Element, State } from '@stencil/core';

@Component({
  tag: 'biggive-form-field-select',
  styleUrl: 'biggive-form-field-select.scss',
  shadow: true,
})
export class BiggiveFormFieldSelect {
  @Element() el: HTMLDivElement;

  @Prop()
  onSelectionChange: (value: string) => void;
  /**
   * Displayed as 'eyebrow' label over the top border of the box.
   */
  @Prop() prompt!: string | null;

  @Prop({ mutable: true }) selectedValue: string | null;
  @Prop({ mutable: true }) selectedLabel: string | null;

  /**
   * JSON array of category key/values, or takes a stringified equiavalent (for Storybook)
   */
  @Prop() options!: string | Record<string, string>;
  @Prop() selectStyle: 'bordered' | 'underlined' = 'bordered';

  /**
   * Must match background of containing element, or unintended shape will appear.
   */
  @Prop() backgroundColour: 'white' | 'grey';

  @State()
  placeHolderRemoved = false;

  doOptionSelectCompletedHandler = event => {
    const value = event.target.value;
    this.selectedValue = value;
    this.selectedLabel = event.target.label;
    if (typeof this.placeholder === 'string') {
      // In future we might want to not remove the placeholder and allow people to go back to it. But
      // we remove it today to maintain the existing filter grid behaviour

      this.placeHolderRemoved = true;
    }
    this.onSelectionChange(value);
  };

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Placeholder
   */
  @Prop() placeholder: string | undefined;

  toggleFocus(event) {
    if (event.target) {
      const dropdown: HTMLElement = event.target.parentElement.parentElement;
      if (dropdown !== null && dropdown !== undefined) {
        if (dropdown.classList.contains('active')) {
          dropdown.classList.remove('active');
        } else {
          dropdown.classList.add('active');
        }
      }
    }
  }

  render() {
    const greyIfRequired = this.backgroundColour === 'grey' ? ' grey' : '';

    let options: Record<string, string>;
    if (typeof this.options === 'string') {
      options = JSON.parse(this.options);
    } else {
      options = this.options;
    }
    if (Array.isArray(options)) {
      options = Object.fromEntries(options.map((value: string) => [value, value]));
    }

    if (this.placeholder && !this.placeHolderRemoved) {
      options = Object.assign({ __placeholder__: this.placeholder }, options);
    }

    return (
      <div>
        <label class={greyIfRequired}>
          <div class={'prompt' + greyIfRequired}>{this.prompt}</div>
          <div class={'dropdown space-below-' + this.spaceBelow + ' select-style-' + this.selectStyle + (this.prompt === null ? '  noprompt' : '')}>
            <div class="sleeve">
              <select class={greyIfRequired} onChange={this.doOptionSelectCompletedHandler}>
                {Object.entries(options).map((value: [string, string]) => (
                  <option selected={this.selectedValue === value[0]} value={value[0]}>
                    {value[1]}
                  </option>
                ))}
              </select>
              <div class="arrow"></div>
            </div>
          </div>
        </label>
      </div>
    );
  }
}
