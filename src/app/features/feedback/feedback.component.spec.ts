import { ComponentFixture, TestBed } from '@angular/core/testing';
import FeedbackComponent from './feedback.component';

describe('FeedbackComponent', () => {
    let component: FeedbackComponent;
    let fixture: ComponentFixture<FeedbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeedbackComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
