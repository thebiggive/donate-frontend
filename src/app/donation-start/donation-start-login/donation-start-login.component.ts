import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Campaign } from 'src/app/campaign.model';
import { LoginModalComponent } from '../../login-modal/login-modal.component';


@Component({
  selector: 'app-donation-start-login',
  templateUrl: './donation-start-login.component.html',
  styleUrls: ['./donation-start-login.component.scss']
})
export class DonationStartLoginComponent {
  @Input({ required: true }) loadAuthedPersonInfo: (dataId: string, dataJwt: string) => void;
  @Input({ required: true }) logout: () => void;
  @Input({ required: true }) campaign: Campaign;
  @Input({ required: true }) creditPenceToUse: number;
  @Input({ required: true }) email?: string;
  @Input({ required: true }) personId: string | undefined;
  @Input({ required: true }) personIsLoginReady: boolean;
  @Input({ required: true }) canLogin: boolean;

  constructor(
    public dialog: MatDialog,
  ) {}

  login = () => {
    const loginDialog = this.dialog.open(LoginModalComponent);
    loginDialog.afterClosed().subscribe((data?: {id: string, jwt: string}) => {
      if (data && data.id) {
        this.loadAuthedPersonInfo(data.id, data.jwt);
        location.reload(); // ensures correct menu is displayed
      }
    });
  }
}
