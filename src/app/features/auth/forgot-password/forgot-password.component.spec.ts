import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { provideValue } from 'src/app/shared/provide';
import { ValidationMessages } from '../shared/validators/validation-messages';
import { RecoveryMessages } from './messages';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ForgotPasswordComponent],
            providers: [
                provideValue(AuthService, {
                    recoverAccount: jest
                        .fn()
                        .mockRejectedValue(new HttpErrorResponse({ status: 500 }))
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should contain an email field', async () => {
        const field = await loader.getHarness(MatFormFieldHarness);
        expect(field).toBeTruthy();
    });

    it('should validate the email', async () => {
        const field = await loader.getHarness(MatFormFieldHarness);
        const control = (await field.getControl(MatInputHarness))!;

        expect(await field.isControlValid()).toBe(false);

        await control.setValue('me');
        expect(await field.isControlValid()).toBe(false);

        await control.setValue('me@mail.com');
        expect(await field.isControlValid()).toBe(true);
    });

    it('should set the email validation message on error', async () => {
        const field = await loader.getHarness(MatFormFieldHarness);
        const control = (await field.getControl(MatInputHarness))!;

        await control.setValue('me');
        await control.blur();

        const errorText = (await field.getTextErrors()).at(0);
        expect(errorText).toEqual(ValidationMessages.email);
    });

    it('should render a submit button', async () => {
        const button = await loader.getHarness(MatButtonHarness);
        expect(button).toBeTruthy();
    });

    it('should call the service with the entered email on submit', async () => {
        const field = await loader.getHarness(MatFormFieldHarness);
        const control = (await field.getControl(MatInputHarness))!;
        const button = await loader.getHarness(MatButtonHarness);
        const authService = TestBed.inject(AuthService);

        await control.setValue('me@mail.com');
        await button.click();

        expect(authService.recoverAccount).toHaveBeenCalledWith('me@mail.com');
    });

    it('should display an error message on request failure', async () => {
        const field = await loader.getHarness(MatFormFieldHarness);
        const control = (await field.getControl(MatInputHarness))!;
        const button = await loader.getHarness(MatButtonHarness);

        await control.setValue('me@mail.com');
        await button.click();

        const error = fixture.debugElement.nativeElement.querySelector('p').textContent;
        expect(error).toEqual(`${RecoveryMessages.failed} (500)`);
    });
});
