import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCidrConverterComponent } from './page-cidr-converter.component';

describe('PageCidrConverterComponent', () => {
    let component: PageCidrConverterComponent;
    let fixture: ComponentFixture<PageCidrConverterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageCidrConverterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PageCidrConverterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
