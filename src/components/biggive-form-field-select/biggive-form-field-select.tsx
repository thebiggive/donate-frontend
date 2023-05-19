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
  doSelectChange: EventEmitter<object>;

  /**
   * Displayed as 'eyebrow' label over the top border of the box.
   */
  @Prop() prompt!: string | null;

  @Prop() selectedValue: string | null;
  @Prop() selectedLabel: string | null;
  @Prop() selectStyle: 'bordered' | 'underlined' = 'bordered';

  /**
   * Must match background of containing element, or unintended shape will appear.
   */
  @Prop() backgroundColour: 'white' | 'grey';

  @Listen('doOptionSelect')
  doOptionSelectCompletedHandler(event) {
    this.selectedValue = event.detail.value;
    this.selectedLabel = event.detail.label;
    this.doSelectChange.emit({ value: this.selectedValue, label: this.selectedLabel, placeholder: this.placeholder });
    if (this.el.shadowRoot !== null && this.el.shadowRoot !== undefined) {
      const dropdown = this.el.shadowRoot.querySelector('.dropdown');
      if (dropdown !== null && dropdown !== undefined) {
        dropdown.classList.remove('active');
      }
    }
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

    return (
      <div class={'dropdown space-below-' + this.spaceBelow + ' select-style-' + this.selectStyle + (this.prompt === null ? '  noprompt' : '')}>
        <div class="sleeve" onClick={this.toggleFocus} onMouseLeave={this.toggleFocus}>
          <span class={'placeholder' + greyIfRequired}>{this.selectedLabel === null || this.selectedLabel === undefined ? this.placeholder : this.selectedLabel}</span>
        </div>
        <div class={'options' + greyIfRequired}>
          <slot></slot>
        </div>
        {this.prompt && <div class={'prompt' + greyIfRequired}>{this.prompt}</div>}
      </div>
    );
  }
}
