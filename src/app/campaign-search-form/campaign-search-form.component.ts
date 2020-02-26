import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-search-form',
  templateUrl: './campaign-search-form.component.html',
  styleUrls: ['./campaign-search-form.component.scss'],
})
export class CampaignSearchFormComponent implements OnInit, OnDestroy {
  @ViewChild('term') termField: ElementRef;
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
    // If the donor hasn't ever typed in the 'term' field yet, they probably didn't mean to start a search,
    // so in this case only treat empty input like an invalid form and point their focus to the field. Otherwise,
    // do this only if the term is invalid based on length (exactly 1 character).
    const term = this.searchForm.get('term');
    if (!term || !term.dirty || !this.searchForm.valid) {
      this.termField.nativeElement.focus();
      return;
    }

    // In all valid cases, including an empty term, update the results.
    this.search.emit(this.searchForm.value.term);
  }
}
