import { Component, Input } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  @Input() listClass: 'bar' | 'tray';
  isGoGiveOnePage: boolean;
  urlChanges;

  constructor(private router: Router, private navigationService: NavigationService) {
    // Listen to url changes and update 'this.isGoGiveOne' accordingly
    this.urlChanges = router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isGoGiveOnePage = navigationService.getIsGoGiveOnePage();
      }
    });
  }
}
