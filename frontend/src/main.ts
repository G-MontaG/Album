import './vendors.ts';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app/app.component';

import { HTTP_PROVIDERS } from '@angular/http';

import './main.scss';

bootstrap(<any>AppComponent, [
  HTTP_PROVIDERS
]);