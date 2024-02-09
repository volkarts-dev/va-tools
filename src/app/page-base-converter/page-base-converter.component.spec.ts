import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBaseConverterComponent } from './page-base-converter.component';

describe('PageBaseConverterComponent', () => {
    let component: PageBaseConverterComponent;
    let fixture: ComponentFixture<PageBaseConverterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageBaseConverterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PageBaseConverterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
