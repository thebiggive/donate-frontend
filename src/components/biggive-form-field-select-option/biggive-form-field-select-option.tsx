import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'biggive-form-field-select-option',
  styleUrl: 'biggive-form-field-select-option.scss',
  shadow: true,
})
export class BiggiveFormFieldSelectOption {
  /**
   * This event `doOptionSelect` event is emitted and propogates to the parent
   * component which handles it
   */
  @Event({
    eventName: 'doOptionSelect',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doOptionSelect: EventEmitter<object>;

  @State() selectedValue: string | null;
  @State() selectedLabel: string | null;

  /**
   * Label
   */
  @Prop() label: string;
  /**
   * Value
   */
  @Prop() value: string;

  private optionSelected = (event: any) => {
    this.selectedValue = event.target.getAttribute('data-value');
    this.selectedLabel = event.target.innerText;

    var keyValuePair = { value: this.selectedValue, label: this.selectedLabel };
    this.doOptionSelect.emit(keyValuePair);
  };

  render() {
    return (
      <div class="option" data-value={this.value} onClick={this.optionSelected}>
        {this.label}
      </div>
    );
  }
}
