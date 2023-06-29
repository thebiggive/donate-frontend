import { Component, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-accordion',
  styleUrl: 'biggive-accordion.scss',
  shadow: true,
})
export class BiggiveAccordion {
  @Element() host: HTMLBiggiveAccordionElement;

  @Prop() spaceBelow: spacingOption = 0;

  @Prop() textColour: brandColour = 'black';

  @Prop() headingColour: brandColour = 'primary';

  children: Array<HTMLBiggiveAccordionEntryElement> = [];

  componentWillLoad() {
    this.children = Array.from(this.host.children) as Array<HTMLBiggiveAccordionEntryElement>;
  }

  toggleSection(e: MouseEvent) {
    const target = (e.target as Element)!;
    const entry = target.closest('.entry')!;
    const arrow = entry.querySelector('.arrow')!;

    if (entry.classList.contains('expanded')) {
      entry.classList.remove('expanded');
      arrow.setAttribute('title', 'Expand section');
    } else {
      entry.classList.add('expanded');
      arrow.setAttribute('title', 'Collapse section');
    }
  }

  render() {
    return (
      <div class={'container' + ' space-below-' + this.spaceBelow + ' text-colour-' + this.textColour + ' heading-colour-' + this.headingColour}>
        <div class="sleeve">
          {this.children.map(entry => (
            <div class="entry">
              <h3 class="heading" onClick={this.toggleSection} title="Expand section">
                {entry.heading}
                <span class="arrow">
                  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.1074 0.999859L7.55357 7.55371L0.999718 0.99986" stroke="black" stroke-width="2" />
                  </svg>
                </span>
              </h3>
              <div class="content" innerHTML={entry.innerHTML}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
