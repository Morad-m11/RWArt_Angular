import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingDirective } from './loading.directive';

describe('LoadingDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    let button: HTMLButtonElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        button = fixture.debugElement.query(By.css('button')).nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.directive).toBeTruthy();
    });

    it('should render original children initially', () => {
        expect(button.querySelector('.child1')).toBeTruthy();
        expect(button.querySelector('.child2')).toBeTruthy();
        expect(button.querySelector('mat-progress-spinner')).toBeFalsy();
    });

    it('should replace children with spinner when loading is true', () => {
        component.loading.set(true);
        fixture.detectChanges();

        expect(button.querySelector('.child1')).toBeFalsy();
        expect(button.querySelector('.child2')).toBeFalsy();
        expect(button.querySelector('mat-progress-spinner')).toBeTruthy();
    });

    it('should restore original children when loading is false', () => {
        component.loading.set(true);
        fixture.detectChanges();

        component.loading.set(false);
        fixture.detectChanges();

        expect(button.querySelector('.child1')).toBeTruthy();
        expect(button.querySelector('.child2')).toBeTruthy();
        expect(button.querySelector('mat-progress-spinner')).toBeFalsy();
    });
});

@Component({
    imports: [LoadingDirective],
    template: `<button [appLoading]="loading()">
        <span class="child1">Child1</span>
        <span class="child2">Child2</span>
    </button>`
})
class TestComponent {
    directive = viewChild.required(LoadingDirective);
    loading = signal(false);
}
