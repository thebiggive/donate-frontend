import { Component, Input } from '@angular/core';
import { HighlightCard } from './HighlightCard';
import { BiggiveBasicCard, BiggiveGrid } from '@biggive/components-angular';

@Component({
  selector: 'app-highlight-cards',
  imports: [BiggiveBasicCard, BiggiveGrid],
  templateUrl: './highlight-cards.component.html',
})
export class HighlightCardsComponent {
  @Input({ required: true }) public highlightCards!: HighlightCard[];
}
