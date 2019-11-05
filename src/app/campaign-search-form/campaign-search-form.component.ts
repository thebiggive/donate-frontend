import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-campaign-search-form',
  templateUrl: './campaign-search-form.component.html',
  styleUrls: ['./campaign-search-form.component.scss'],
})
export class CampaignSearchFormComponent implements OnInit {
  @Input() campaignId: string;
  @Output() search: EventEmitter<any> = new EventEmitter();

  public searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      term: [null, [
        Validators.required,
        Validators.minLength(2),
      ]],
    });
  }

  submit() {
    this.search.emit(this.searchForm.value.term);
  }
}
