import { Routes } from '@angular/router';
import { PageHomeComponent } from './page-home/components/page-home/page-home.component';
import { PageCidrConverterComponent } from './page-cidr-converter/components/page-cidr-converter/page-cidr-converter.component';
import { PagePasswordGeneratorComponent } from './page-password-generator/components/page-password-generator/page-password-generator.component';
import { PageBaseConverterComponent } from './page-base-converter/components/page-base-converter/page-base-converter.component';

export const routes: Routes = [
    { path: "", component: PageHomeComponent },
    { path: "cidr-converter", component: PageCidrConverterComponent },
    { path: "base-converter", component: PageBaseConverterComponent },
    { path: "password-generator", component: PagePasswordGeneratorComponent },
];
