import { Component, Prop, h, Event, Element, EventEmitter, Listen } from '@stencil/core';

@Component({
  tag: 'biggive-form-field-select',
  styleUrl: 'biggive-form-field-select.scss',
  shadow: true,
})
export class BiggiveFormFieldSelect {
  @Element() el: HTMLDivElement;
  /**
   * This event `doChange` event is emitted and propogates to the parent
   * component which handles it
   */
  @Event({
    eventName: 'doSelectChange',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  @Prop() onChange: (value: string) => void;
  /**
   * Displayed as 'eyebrow' label over the top border of the box.
   */
  @Prop() prompt!: string | null;

  @Prop() selectedValue: string | null;
  @Prop() selectedLabel: string | null;

  /**
   * JSON array of category key/values, or takes a stringified equiavalent (for Storybook)
   */
  @Prop() options!: string | Record<string, string>;
  @Prop() selectStyle: 'bordered' | 'underlined' = 'bordered';

  /**
   * Must match background of containing element, or unintended shape will appear.
   */
  @Prop() backgroundColour: 'white' | 'grey';

  doOptionSelectCompletedHandler(event) {
    console.log({ event });
    this.selectedValue = event.target.value;
    this.selectedLabel = event.target.label;
  }

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Placeholder
   */
  @Prop() placeholder: string;

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
