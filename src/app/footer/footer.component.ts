import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public now: number = Date.now();
  isGoGiveOnePage = false;
  urlChanges;

  constructor(private router: Router, private navigationService: NavigationService) {
    // Listen to url changes and update 'this.isGoGiveOne' accordingly
    this.urlChanges = router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isGoGiveOnePage = navigationService.getIsGoGiveOnePage();
      }
    });
  }

  ngOnInit() {
  }

}
