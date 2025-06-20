import { bootstrapApplication } from '@angular/platform-browser';
import { setAssetPath } from '@biggive/components/dist/components';
import { register as registerSwiper } from 'swiper/element/bundle';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

setAssetPath(`${environment.donateUriPrefix}/assets`);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

registerSwiper();
