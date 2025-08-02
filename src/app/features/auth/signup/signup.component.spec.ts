import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { provideValue } from 'src/app/shared/provide';
import { UserService } from 'src/app/shared/services/user/user.service';
import { DummyComponent } from '../shared/test/dummy.component';
import { ASYNC_VALIDATION_DELAY } from '../shared/validators/unique/unique-user.validator';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;

    let router: Router;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignupComponent],
            providers: [
                provideValue(AuthService, { signup: jest.fn().mockResolvedValue(null) }),
                provideValue(UserService, {
                    isUnique: jest.fn().mockReturnValue(of(true))
                }),
                provideRouter([
                    {
                        path: 'auth',
                        children: [
                            { path: 'login', component: SignupComponent },
                            { path: 'signup', component: DummyComponent },
                            { path: 'verify', component: DummyComponent }
                        ]
                    }
                ])
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
        await router.navigate(['auth', 'signup']);

        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Form fields', () => {
        it('should render all fields', async () => {
            const fields = await loader.getAllHarnesses(MatFormFieldHarness);

            const fieldLabels = await parallel(() => fields.map((x) => x.getLabel()));
            expect(fieldLabels).toEqual([
                'Email',
                'Username',
                'Password',
                'Confirm password'
            ]);
        });

        it('should set the fields values', async () => {
            const [mail, name, pass, confirm] = await getAllControls();

            await mail.setValue('mail');
            await name.setValue('name');
            await pass.setValue('pass');
            await confirm.setValue('confirm');

            expect(component.form.value).toEqual<typeof component.form.value>({
                email: 'mail',
                username: 'name',
                password: 'pass',
                passwordConfirm: 'confirm'
            });
        });

        describe('Validation', () => {
            it('should validate email asynchronously when valid', async () => {
                const [mail] = await getAllFields();
                const input = (await mail.getControl(MatInputHarness))!;

                jest.useFakeTimers();

                expect(await mail.isControlValid()).toBe(false);

                await input.setValue('me');
                expect(await mail.isControlValid()).toBe(false);

                await input.setValue('me@hotmail.com');
                await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
                expect(await mail.isControlValid()).toBe(true);
            });

            it('should validate username asynchronously ', async () => {
                const [, name] = await getAllFields();
                const input = (await name.getControl(MatInputHarness))!;

                jest.useFakeTimers();

                expect(await name.isControlValid()).toBe(false);

                await input.setValue('me');
                await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
                expect(await name.isControlValid()).toBe(true);
            });

            it('should validate password & confirmation', async () => {
                const [, , pass, confirm] = await getAllFields();
                const [, , passControl, confirmControl] = await getAllControls();

                await passControl.setValue('password');
                await confirmControl.setValue('password2');

                expect(await pass.isControlValid()).toBe(true);
                expect(await confirm.isControlValid()).toBe(false);

                await confirmControl.setValue('password');
                expect(await confirm.isControlValid()).toBe(true);
            });
        });
    });

    describe('Submit button', () => {
        describe('Rendering & Disabled State', () => {
            it('should render', async () => {
                const button = await getSubmitButton();
                expect(button).toBeTruthy();
            });

            it('should be disabled initially', async () => {
                const button = await getSubmitButton();
                expect(await button.isDisabled()).toBe(true);
            });

            it('should be enabled when all fields filled', async () => {
                const button = await getSubmitButton();

                await fillAllFieldsValid();

                expect(await button.isDisabled()).toBe(false);
            });
        });

        describe('Click', () => {
            let authService: jest.Mocked<AuthService>;

            beforeEach(() => {
                authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
            });

            it('should call auth service signup on click', async () => {
                const button = await getSubmitButton();

                await fillAllFieldsValid();
                await button.click();

                expect(authService.signup).toHaveBeenCalledWith({
                    email: component.form.controls.email.value,
                    username: component.form.controls.username.value,
                    password: component.form.controls.password.value
                });
            });

            it('should set an error message on request error', async () => {
                authService.signup.mockRejectedValue('failed');
                const errorSetSpy = jest.spyOn(component.errorMessage, 'set');
                const button = await getSubmitButton();

                await fillAllFieldsValid();
                await button.click();

                expect(errorSetSpy).toHaveBeenCalled();
            });

            it('should not route on error', async () => {
                const button = await getSubmitButton();
                authService.signup.mockRejectedValue('failed');

                await fillAllFieldsValid();
                await button.click();

                expect(router.url).toEqual('/auth/signup');
            });

            it('should route on success', async () => {
                const button = await getSubmitButton();

                await fillAllFieldsValid();
                await button.click();

                expect(router.url).toEqual('/auth/verify');
            });
        });
    });

    describe('Additional Routing Buttons', () => {
        it('should contain a button to route to login', async () => {
            const login = await loader.getHarness(
                MatButtonHarness.with({ selector: '#login-button' })
            );
            expect(login).toBeTruthy();
        });

        it('should route to login page on button click', async () => {
            const login = await loader.getHarness(
                MatButtonHarness.with({ selector: '#login-button' })
            );

            await login.click();

            expect(router.url).toEqual('/auth/login');
        });
    });

    async function getSubmitButton() {
        return await loader.getHarness(
            MatButtonHarness.with({ selector: '#submit-button' })
        );
    }

    async function getAllFields(): Promise<MatFormFieldHarness[]> {
        return await loader.getAllHarnesses(MatFormFieldHarness);
    }

    async function getAllControls(): Promise<MatInputHarness[]> {
        const fields = await getAllFields();
        const inputs = await parallel(() =>
            fields.map((x) => x.getControl(MatInputHarness))
        );
        return inputs as MatInputHarness[];
    }

    async function fillAllFieldsValid() {
        const [mail, name, pass, confirm] = await getAllControls();

        jest.useFakeTimers();

        await parallel(() => [
            mail.setValue('mail@hotmail.com'),
            name.setValue('name'),
            pass.setValue('password'),
            confirm.setValue('password')
        ]);

        // duration * 2 for both field validations
        await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY * 2);
        jest.useRealTimers();
    }
});
