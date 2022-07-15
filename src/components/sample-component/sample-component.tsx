import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sample-component',
  styleUrl: 'sample-component.css',
  shadow: true,
})
export class SampleComponent {

  @Prop({ mutable: true }) label: string = "";
  @Prop({ mutable: true }) meta: string = "";
  @Prop({ mutable: true }) callToActionUrl: string = "";
  @Prop({ mutable: true }) callToActionText: string = "";

  render() {
    return (
      <div class="container">
        <h3 class="label">{this.label}</h3>
        <div class="meta">{this.meta}</div>
        <sample-component-child url={this.callToActionUrl} text={this.callToActionText}></sample-component-child>
      </div>
    );
  }

}
