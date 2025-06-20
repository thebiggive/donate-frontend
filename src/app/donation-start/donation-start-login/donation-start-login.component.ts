import { Component, EventEmitter, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Campaign } from '../../campaign.model';
import { LoginModalComponent } from '../../login-modal/login-modal.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ExactCurrencyPipe } from '../../exact-currency.pipe';

@Component({
  selector: 'app-donation-start-login',
  templateUrl: './donation-start-login.component.html',
  styleUrl: './donation-start-login.component.scss',
  imports: [MatButton, RouterLink, ExactCurrencyPipe],
})
export class DonationStartLoginComponent {
  dialog = inject(MatDialog);

  @Input({ required: true }) loadAuthedPersonInfo!: (dataId: string, dataJwt: string) => void;
  @Input({ required: true }) campaign!: Campaign;
  @Input({ required: true }) creditPenceToUse!: number;
  @Input({ required: true }) email: string = '';
  @Input({ required: true }) personId: string | undefined;
  @Input({ required: false }) loggedInWithPassword?: boolean;

  @Input({ required: true }) public loginChangeEmitter!: EventEmitter<boolean>;

  login = () => {
    const loginDialog = this.dialog.open(LoginModalComponent);
    loginDialog.afterClosed().subscribe((data?: { id: string; jwt: string }) => {
      if (data && data.id) {
        this.loadAuthedPersonInfo(data.id, data.jwt);
        this.loginChangeEmitter.emit(true);
      }
    });
  };
}
