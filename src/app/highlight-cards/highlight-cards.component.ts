import {Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {HighlightCard} from "./HighlightCard";
import {ComponentsModule} from "@biggive/components-angular";

@Component({
  selector: 'app-highlight-cards',
  imports: [
    ComponentsModule,
  ],
  templateUrl: './highlight-cards.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HighlightCardsComponent {
  @Input({ required: true }) protected highlightCards: HighlightCard[];
}
