import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Campaign } from 'src/app/campaign.model';
import { LoginModalComponent } from '../../login-modal/login-modal.component';


@Component({
  selector: 'app-donation-start-login',
  templateUrl: './donation-start-login.component.html',
  styleUrls: ['./donation-start-login.component.scss']
})
export class DonationStartLoginComponent {
  @Input() loadAuthedPersonInfo: (dataId: string, dataJwt: string) => void;
  @Input() logout: () => void;
  @Input() campaign: Campaign;
  @Input() creditPenceToUse: number;
  @Input() email: string;
  @Input() personId: string | undefined;
  @Input() personIsLoginReady: boolean;
  @Input() canLogin: boolean;
//  @Input() idCaptcha: RecaptchaComponent;

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

  onLogout = () => {
    this.logout();
  }
}
