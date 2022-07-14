import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sample-component-child',
  styleUrl: 'sample-component-child.css',
  shadow: true,
})
export class SampleComponentChild {

  @Prop({ mutable: true }) url: string = "";
  @Prop({ mutable: true }) text: string = "";


  render() {
    return (
      <div class="call-to-action"><a href={this.url}>{this.text}</a></div>
    );
  }

}
