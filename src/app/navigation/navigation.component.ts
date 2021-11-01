import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  opened = false;
  isGoGiveOnePage: boolean;
  urlChanges;

  constructor(private router: Router, private navigationService: NavigationService) {
    // Listen to url changes and update 'this.isGoGiveOne' accordingly
    this.urlChanges = router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isGoGiveOnePage = (event.url === '/gogiveone');
      }
    });

    this.navigationService.isGG1PageEventListener().subscribe(isGoGiveOnePage => {
      this.isGoGiveOnePage = isGoGiveOnePage;
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
    ).subscribe(() => this.opened = false);
  }


  ngOnDestroy(): void {
    this.urlChanges.unsubscribe();
  }
}
