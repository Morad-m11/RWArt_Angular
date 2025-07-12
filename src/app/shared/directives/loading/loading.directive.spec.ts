import { Component, DebugElement, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingDirective } from './loading.directive';

describe('LoadingDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    let buttonDe: DebugElement;
    let buttonEl: HTMLButtonElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        buttonDe = fixture.debugElement.query(By.css('button'));
        buttonEl = buttonDe.nativeElement as HTMLButtonElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.directive).toBeTruthy();
    });

    it('should render original children initially', () => {
        expect(buttonEl.querySelector('.child1')).toBeTruthy();
        expect(buttonEl.querySelector('.child2')).toBeTruthy();
        expect(buttonEl.querySelector('mat-progress-spinner')).toBeFalsy();
    });

    it('should replace children with spinner when loading is true', () => {
        component.loading.set(true);
        fixture.detectChanges();

        expect(buttonEl.querySelector('.child1')).toBeFalsy();
        expect(buttonEl.querySelector('.child2')).toBeFalsy();
        expect(buttonEl.querySelector('mat-progress-spinner')).toBeTruthy();
    });

    it('should restore original children when loading is false', () => {
        component.loading.set(true);
        fixture.detectChanges();

        component.loading.set(false);
        fixture.detectChanges();

        expect(buttonEl.querySelector('.child1')).toBeTruthy();
        expect(buttonEl.querySelector('.child2')).toBeTruthy();
        expect(buttonEl.querySelector('mat-progress-spinner')).toBeFalsy();
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
