import './vendors.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule}from './app/app.module.ngfactory';

import './main.scss';

platformBrowserDynamic().bootstrapModule(AppModule);