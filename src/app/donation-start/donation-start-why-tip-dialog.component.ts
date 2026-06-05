import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { PopupStandaloneComponent } from '../popup-standalone/popup-standalone.component';

@Component({
  selector: 'app-donation-start-why-tip-dialog',
  templateUrl: 'donation-start-why-tip-dialog.html',
  imports: [MatButtonModule, MatDialogModule, PopupStandaloneComponent],
})
export class DonationStartWhyTipDialogComponent {}
