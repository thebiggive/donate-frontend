import { Component } from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";

@Component({
  selector: 'app-my-donations',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './my-donations.component.html',
  styleUrl: './my-donations.component.scss'
})
export class MyDonationsComponent {

}
