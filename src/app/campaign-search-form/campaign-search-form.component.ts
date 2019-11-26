import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-search-form',
  templateUrl: './campaign-search-form.component.html',
  styleUrls: ['./campaign-search-form.component.scss'],
})
export class CampaignSearchFormComponent implements OnInit, OnDestroy {
  @Input() campaignId: string;
  @Input() reset: Observable<void>;
  @Output() search: EventEmitter<any> = new EventEmitter();

  public searchForm: FormGroup;

  private resetSubscription: Subscription;

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

    this.resetSubscription = this.reset.subscribe(() => {
      this.searchForm.reset();
    });
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }

  submit() {
    this.search.emit(this.searchForm.value.term);
  }
}
