import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'biggive-timeline-entry',
  styleUrl: 'biggive-timeline-entry.scss',
  shadow: true,
})
export class BiggiveTimelineEntry {
  /**
   * Should be in the format 'YYYY-mm-dd', for example '2023-01-01'
   */
  @Prop() date: string;

  @Prop() heading: string;

  render() {
    return null;
  }
}
