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
      term: [null, [
        Validators.required,
        Validators.minLength(2),
      ]],
    });
  }

  public search() {
    this.router.navigateByUrl(`/search?term=${this.searchForm.value.term}`);
  }
}
