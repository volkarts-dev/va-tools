import { Component } from '@angular/core';
import { NavLinkDirective } from '../../directives/navlink.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        NavLinkDirective,
        RouterLink,
    ],
    templateUrl: './navbar.component.html',
    styles: ``
})
export class NavbarComponent {

}
