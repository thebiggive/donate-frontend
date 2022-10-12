import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-buy-credits',
  templateUrl: './buy-credits.component.html',
  styleUrls: ['./buy-credits.component.scss']
})
export class BuyCreditsComponent implements OnInit {

  isLoggedIn: boolean = true;
  userFullName: string;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userFullName = 'Ali Hejazi';
  }

  buyCredits(): void {
    console.log('POST /credits');
  }

}
