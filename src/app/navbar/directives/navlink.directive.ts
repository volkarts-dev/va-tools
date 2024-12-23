import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";

@Directive({
    standalone: true,
    selector: "[appNavLink]"
})
export class NavLinkDirective {
    @Input() href?: string;

    constructor(
        private router: Router,
        private element: ElementRef,
    ) {
    }

    @HostBinding('attr.aria-current') get ariaCurrent() {
        return this.isActive ? "page" : null;
    }

    @HostBinding('class.active') get isActive() {
        return this.router.url === this.href;
    }
}
