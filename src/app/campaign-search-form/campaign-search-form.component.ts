import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-search-form',
  templateUrl: './campaign-search-form.component.html',
  styleUrls: ['./campaign-search-form.component.scss'],
})
export class CampaignSearchFormComponent implements OnInit {
  public searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      summerGive19: [false],
      term: [null, [
        Validators.required,
        Validators.minLength(2),
      ]],
    });
  }

  public search() {
    let url = `/search?term=${this.searchForm.value.term}`;

    if (this.searchForm.value.summerGive19) {
      url = `${url}&parent=a051r00001CGEpoAAH`;
    }

    this.router.navigateByUrl(url);
  }
}
