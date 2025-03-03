import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';

import { routes } from './app.routes';

import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes)
    ],
};
