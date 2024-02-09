import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePasswordGeneratorComponent } from './page-password-generator.component';

describe('PagePasswordGeneratorComponent', () => {
    let component: PagePasswordGeneratorComponent;
    let fixture: ComponentFixture<PagePasswordGeneratorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PagePasswordGeneratorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PagePasswordGeneratorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
