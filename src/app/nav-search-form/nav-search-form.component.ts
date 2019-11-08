import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-search-form',
  templateUrl: './nav-search-form.component.html',
  styleUrls: ['./nav-search-form.component.scss']
})
export class NavSearchFormComponent implements OnInit {
  public searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      term: [null, [
        Validators.required,
        Validators.minLength(2),
      ]],
    });
  }

  public search() {
    let url = `/search?term=${this.searchForm.value.term}`;

    this.router.navigateByUrl(url);
  }
}
