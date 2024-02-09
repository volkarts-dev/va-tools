import { Routes } from '@angular/router';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageCidrConverterComponent } from './page-cidr-converter/page-cidr-converter.component';
import { PageBaseConverterComponent } from './page-base-converter/page-base-converter.component';
import { PagePasswordGeneratorComponent } from './page-password-generator/page-password-generator.component';

export const routes: Routes = [
    { path: "", component: PageHomeComponent },
    { path: "cidr-converter", component: PageCidrConverterComponent },
    { path: "base-converter", component: PageBaseConverterComponent },
    { path: "password-generator", component: PagePasswordGeneratorComponent },
];
