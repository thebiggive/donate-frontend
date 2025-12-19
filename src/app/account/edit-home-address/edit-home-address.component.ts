import { Component, OnInit, inject } from '@angular/core';
import { PageMetaService } from '../../page-meta.service';
import { DatePipe } from '@angular/common';
import { IdentityService } from '../../identity.service';
import { Person } from '../../person.model';
import { Router } from '@angular/router';
import { BiggivePageSection, BiggiveHeading } from '@biggive/components-angular';
import { flags } from '../../featureFlags';

@Component({
  selector: 'app-my-account',
  templateUrl: './edit-home-address.component.html',
  styleUrl: './edit-home-address.component.scss',
  providers: [DatePipe],
  imports: [BiggivePageSection, BiggiveHeading],
})
export class EditHomeAddress implements OnInit {
  private pageMeta = inject(PageMetaService);
  private identityService = inject(IdentityService);
  private router = inject(Router);

  public person!: Person;

  ngOnInit() {
    this.pageMeta.setCommon(
      'My account',
      'Manage your Big Give account',
      null, // page is available to account holders only, social sharing doesn't make sense here.
    );

    this.identityService.getLoggedInPerson().subscribe(async (person: Person | null) => {
      if (!person) {
        await this.router.navigate(['']);
      } else {
        this.person = person;
      }
    });
  }

  protected readonly flags = flags;
}
