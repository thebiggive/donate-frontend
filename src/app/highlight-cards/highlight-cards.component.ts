import { Component, inject, Input, OnInit } from '@angular/core';
import { HighlightCard } from './HighlightCard';
import { BiggiveBasicCard, BiggiveGrid } from '@biggive/components-angular';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-highlight-cards',
  imports: [BiggiveBasicCard, BiggiveGrid],
  templateUrl: './highlight-cards.component.html',
})
export class HighlightCardsComponent implements OnInit {
  @Input({ required: true }) public highlightCards!: HighlightCard[];
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    if (environment.environmentId === 'production') {
      return;
    }

    // allows testing the layout with space for an extra card - to artificially add one more card
    // add `?repeatLastCard=true` on to the end of the URL when viewing anywhere but prod.

    const params = this.activatedRoute?.snapshot?.queryParams;
    if (params?.repeatLastCard && this.highlightCards) {
      this.highlightCards.push(this.highlightCards[this.highlightCards.length - 1]);
    }
  }

  get columnCount(): number {
    const cardCount = this.highlightCards.length;

    if (cardCount === 4) {
      return 2;
    }

    return Math.min(this.highlightCards.length, 3);
  }
}
