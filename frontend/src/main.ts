import './vendors.ts';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app/app.component';
import {appRouterProviders} from './app/app.routes';

import { HTTP_PROVIDERS } from '@angular/http';

import './main.scss';

bootstrap(<any>AppComponent, [
  HTTP_PROVIDERS, appRouterProviders
]).catch(err => console.error(err));