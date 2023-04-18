import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RecaptchaComponent } from "ng-recaptcha";
import { FormGroup } from '@angular/forms';

//export type DataType = { name: string };


@Injectable({ providedIn: 'root' })
export class DonationStartService {

    

    // Emit captcha object so that it can be reset on logout
    captchaEventSubject: Subject<RecaptchaComponent> = new Subject<RecaptchaComponent>();
  
    emitCaptchaEventToParent(idCaptcha: RecaptchaComponent) {
      this.captchaEventSubject.next(idCaptcha);
    }


  
    // Emit donationForm to parent, so that it can be reset on logout
    donationFormEventSubject: Subject<FormGroup> = new Subject<FormGroup>();
    
    emitdonationFormToParent(donationForm: FormGroup) {
      this.donationFormEventSubject.next(donationForm);
    }

    
}



