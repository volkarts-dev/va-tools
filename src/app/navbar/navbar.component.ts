import { Component } from '@angular/core';
import { NavLinkDirective } from './navlink.directive';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        NavLinkDirective,
    ],
    templateUrl: './navbar.component.html',
    styles: ``
})
export class NavbarComponent {

}
