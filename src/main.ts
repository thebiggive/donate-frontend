import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@biggive/components/loader';
import { register as registerSwiper } from 'swiper/element/bundle';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// As discussed, this is the modern way to load the component library.
defineCustomElements(window);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

registerSwiper();
