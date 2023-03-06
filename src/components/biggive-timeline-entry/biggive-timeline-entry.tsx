import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'biggive-timeline-entry',
  styleUrl: 'biggive-timeline-entry.scss',
  shadow: true,
})
export class BiggiveTimelineEntry {
  @Prop() entryDate: string;

  @Prop() entryYear: string;

  @Prop() entryTitle: string;

  render() {
    return null;
  }
}
