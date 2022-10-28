import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { allChildComponentImports } from '../../allChildComponentImports';
import { SearchService } from '../search.service';

@Component({
  standalone: true,
  selector: 'app-campaign-search-form',
  templateUrl: './campaign-search-form.component.html',
  styleUrls: ['./campaign-search-form.component.scss'],
  imports: [
    ...allChildComponentImports,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class CampaignSearchFormComponent implements OnInit {
  @ViewChild('term') termField: ElementRef;
  @Input() getDefaultSort: () => string;
  /** Whether to navigate to the full Explore page instead of searching in context. */
  @Input() jumpToExplore?: boolean;
  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public search: SearchService,
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      term: [this.search.selected.term, [
        Validators.minLength(2),
      ]],
    });
    this.search.changed.subscribe(() => this.searchForm.patchValue({ term: this.search.selected.term }));
  }

  submit() {
    const term = this.searchForm.value.term;

    if (term === '' && this.search.hasTermFilterApplied()) {
      // Newly-blank term -> clear query param and do a new search.
      this.search.search('', this.getDefaultSort());
      return;
    }

    // If the donor hasn't ever typed in the 'term' field yet, they probably didn't mean to start a search,
    // so in this case only treat empty input like an invalid form and point their focus to the field. Otherwise,
    // do this only if the term is invalid based on length (exactly 1 character).
    if ((term || '').length < 2) {
      this.termField.nativeElement.focus();
      return;
    }

    if (this.jumpToExplore) {
      this.router.navigate(['explore'], {
        queryParams: { term },
      });

      return;
    }

    this.search.search(term, this.getDefaultSort());
  }
}
