import { Component, Prop, h, State, Event, EventEmitter, Listen } from '@stencil/core';

@Component({
  tag: 'biggive-form-field-select',
  styleUrl: 'biggive-form-field-select.scss',
  shadow: true,
})
export class BiggiveFormFieldSelect {
  /**
   * This event `doChange` event is emitted and propogates to the parent
   * component which handles it
   */
  @Event({
    eventName: 'doChange',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doChange: EventEmitter<string>;

  @State() selectedValue: string = null;
  @State() selectedLabel: string = null;

  @Listen('doOptionSelect')
  doOptionSelectCompletedHandler(event) {
    this.selectedValue = event.detail.value;
    this.selectedLabel = event.detail.label;
  }

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Placeholder
   */
  @Prop() placeholder: string = null;

  render() {
    return (
      <div class={'dropdown space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <span class="placeholder">{this.selectedLabel == null ? this.placeholder : this.selectedLabel}</span>
        </div>
        <div class="options">
          <slot></slot>
        </div>
      </div>
    );
  }
}
