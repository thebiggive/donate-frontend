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

  @Prop() selectedValue: string = null;
  @Prop() selectedLabel: string = null;

  @Listen('doOptionSelect')
  doOptionSelectCompletedHandler(event) {
    this.selectedValue = event.detail.value;
    this.selectedLabel = event.detail.label;
    this.doSelectChange.emit({ value: this.selectedValue, label: this.selectedLabel, placeholder: this.placeholder });
    if (this.el.shadowRoot !== null && this.el.shadowRoot !== undefined) {
      const dropdown: HTMLDivElement = this.el.shadowRoot.querySelector('.dropdown');
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
  @Prop() placeholder: string = null;

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
    return (
      <div class={'dropdown space-below-' + this.spaceBelow}>
        <div class="sleeve" onClick={this.toggleFocus} onMouseLeave={this.toggleFocus}>
          <span class="placeholder">{this.selectedLabel === null ? this.placeholder : this.selectedLabel}</span>
        </div>
        <div class="options">
          <slot></slot>
        </div>
      </div>
    );
  }
}
