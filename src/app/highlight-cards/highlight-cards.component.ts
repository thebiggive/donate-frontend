import {Component, Input} from '@angular/core';
import {HighlightCard} from "../highlight-cards/HighlightCard";
import {ComponentsModule} from "@biggive/components-angular";

@Component({
  selector: 'app-highlight-cards',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './highlight-cards.component.html',
})
export class HighlightCardsComponent {
  @Input({ required: true }) protected highlightCards: HighlightCard[];
}
