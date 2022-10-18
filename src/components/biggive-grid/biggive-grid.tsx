import { Component, Prop, Element, h } from '@stencil/core';

@Component({
  tag: 'biggive-grid',
  styleUrl: 'biggive-grid.scss',
  shadow: true,
})
export class BiggiveGrid {
  @Element() host: HTMLBiggiveGridElement;

  children: Element[] = [];

  /**
   * Column count
   */
  @Prop() columnCount: number = 3;

  /**
   * Column gap
   */
  @Prop() columnGap: number = 3;

  //componentDidRender() {
  //  let slotted = this.host.shadowRoot.querySelector('slot') as HTMLSlotElement;
  //
  //  if (slotted != null && slotted.assignedElements().length > 0) {
  //    this.children = slotted.assignedElements().filter(node => {
  //      return node.nodeName !== '#text';
  //    });
  //  } else {
  //    this.children = [];
  //  }
  //}

  render() {
    return (
      <div class={'grid column-count-' + this.columnCount + ' column-gap-' + this.columnGap} data-column-count={this.columnCount} data-column-gap={this.columnGap}>
        <slot name="grid-items"></slot>
        {this.children.map(child => {
          return <div innerHTML={child.outerHTML}></div>;
        })}
      </div>
    );
  }
}
