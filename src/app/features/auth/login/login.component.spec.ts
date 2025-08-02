import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { provideValue } from 'src/app/shared/provide';
import { DummyComponent } from '../shared/test/dummy.component';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    let router: Router;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                provideValue(AuthService, { login: jest.fn().mockResolvedValue(null) }),
                provideValue(SnackbarService, { success: jest.fn() }),
                provideRouter([
                    {
                        path: 'auth',
                        children: [
                            { path: 'login', component: LoginComponent },
                            { path: 'recovery', component: DummyComponent },
                            { path: 'signup', component: DummyComponent }
                        ]
                    }
                ])
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
        await router.navigate(['auth', 'login']);

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Form fields', () => {
        it('should render username & password field', async () => {
            const fields = await loader.getAllHarnesses(MatFormFieldHarness);

            expect(fields).toHaveLength(2);
            expect(await fields[0].getLabel()).toBe('Username');
            expect(await fields[1].getLabel()).toBe('Password');
        });

        it('should set the fields values', async () => {
            const [name, pass] = await getBothControls();

            await name!.setValue('my name');
            await pass!.setValue('my pass');

            expect(component.form.value).toEqual({
                username: 'my name',
                password: 'my pass'
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

            it('should be enabled when both required fields are filled', async () => {
                const button = await getSubmitButton();
                const [name, pass] = await getBothControls();

                await name.setValue('name');
                expect(await button.isDisabled()).toBe(true);

                await pass.setValue('pass');
                expect(await button.isDisabled()).toBe(false);
            });
        });

        describe('Click', () => {
            let authService: jest.Mocked<AuthService>;

            beforeEach(() => {
                authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
            });

            it('should call auth service login on click', async () => {
                const [name, pass] = await getBothControls();
                const button = await getSubmitButton();

                await name.setValue('name');
                await pass.setValue('pass');
                await button.click();

                expect(authService.login).toHaveBeenCalledWith('name', 'pass');
            });

            it('should set an error message on request error', async () => {
                authService.login.mockRejectedValue('failed');
                const errorSetSpy = jest.spyOn(component.errorMessage, 'set');
                const [name, pass] = await getBothControls();
                const button = await getSubmitButton();

                await name.setValue('name');
                await pass.setValue('pass');
                await button.click();

                expect(errorSetSpy).toHaveBeenCalled();
            });

            it('should not route on error', async () => {
                const [name, pass] = await getBothControls();
                const button = await getSubmitButton();
                authService.login.mockRejectedValue('failed');

                await name.setValue('name');
                await pass.setValue('pass');
                await button.click();

                expect(router.url).toEqual('/auth/login');
            });

            it('should route on success', async () => {
                const [name, pass] = await getBothControls();
                const button = await getSubmitButton();

                await name.setValue('name');
                await pass.setValue('pass');
                await button.click();

                expect(router.url).toEqual('/');
            });
        });
    });

    describe('Additional Routing Buttons', () => {
        it('should contain password recovery and account creation button', async () => {
            const recovery = await loader.getHarness(
                MatButtonHarness.with({ selector: '#recovery-button' })
            );

            const signup = await loader.getHarness(
                MatButtonHarness.with({ selector: '#signup-button' })
            );

            expect(recovery).toBeTruthy();
            expect(signup).toBeTruthy();
        });

        it('should route to recovery page on button click', async () => {
            const recovery = await loader.getHarness(
                MatButtonHarness.with({ selector: '#recovery-button' })
            );

            await recovery.click();

            expect(router.url).toEqual('/auth/recovery');
        });

        it('should route to the signup page on button click', async () => {
            const signup = await loader.getHarness(
                MatButtonHarness.with({ selector: '#signup-button' })
            );

            await signup.click();

            expect(router.url).toEqual('/auth/signup');
        });
    });

    async function getSubmitButton() {
        return await loader.getHarness(
            MatButtonHarness.with({ selector: '#submit-button' })
        );
    }

    async function getBothControls(): Promise<[MatInputHarness, MatInputHarness]> {
        const fields = await loader.getAllHarnesses(MatFormFieldHarness);
        const [name, pass] = await parallel(() =>
            fields.map((x) => x.getControl(MatInputHarness))
        );

        return [name!, pass!];
    }
});
