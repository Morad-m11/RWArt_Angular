import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { ValidationMessages } from '../../validators/validation-messages';
import { FormErrorDirective } from './form-error.directive';

describe('FormErrorComponent', () => {
    let fixture: ComponentFixture<HostComponent>;
    let component: HostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render "required" message on empty field', async () => {
        component.control.updateValueAndValidity();
        await fixture.whenStable();

        const titleElement = fixture.nativeElement.querySelector('h1');
        const title = titleElement.textContent;
        expect(title).toContain('Field is required');
    });

    it('should render "email" error', async () => {
        component.control.setValue('some value');
        component.control.updateValueAndValidity();
        await fixture.whenStable();

        const titleElement = fixture.nativeElement.querySelector('h1');
        const title = titleElement.textContent;
        expect(title).toBe(ValidationMessages.email);
    });
});

@Component({
    imports: [FormErrorDirective],
    template: '<h1 [appFormError]="control">hello</h1>'
})
class HostComponent {
    control = new FormControl('', [Validators.required, Validators.email]);
}
