import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'biggive-accordion-entry',
  styleUrl: 'biggive-accordion-entry.scss',
  shadow: true,
})
export class BiggiveAccordionEntry {
  @Element() host: HTMLBiggiveAccordionEntryElement;

  @Prop() entryHeading: string = '';

  render() {
    return null;
  }
}
