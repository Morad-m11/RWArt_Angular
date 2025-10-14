import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FeaturedComponent } from './featured.component';

describe('FeaturedComponent', () => {
    let component: FeaturedComponent;
    let fixture: ComponentFixture<FeaturedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeaturedComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
