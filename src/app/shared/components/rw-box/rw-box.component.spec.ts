import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RwBoxComponent } from './rw-box.component';

describe('RwBoxComponent', () => {
    let component: RwBoxComponent;
    let fixture: ComponentFixture<RwBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RwBoxComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RwBoxComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
