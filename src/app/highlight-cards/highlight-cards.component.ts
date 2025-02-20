import {Component, Input} from '@angular/core';
import {HighlightCard} from "./HighlightCard";
import {ComponentsModule} from "@biggive/components-angular";

@Component({
    selector: 'app-highlight-cards',
    imports: [
        ComponentsModule
    ],
    templateUrl: './highlight-cards.component.html'
})
export class HighlightCardsComponent {
  @Input({ required: true }) public highlightCards!: HighlightCard[];
}
