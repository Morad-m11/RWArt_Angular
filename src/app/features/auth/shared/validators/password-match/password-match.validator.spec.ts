import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

fdescribe('PasswordMatch Validator', () => {
    describe('Standalone', () => {
        const validator = passwordMatchValidator;

        it('should throw if either password control is missing', () => {
            const withoutConfirm = new FormGroup({ password: new FormControl('') });
            const withoutPassword = new FormGroup({
                passwordConfirm: new FormControl('')
            });
            const withBoth = new FormGroup({
                password: new FormControl(''),
                passwordConfirm: new FormControl('')
            });

            expect(() => validator(withoutConfirm)).toThrow();
            expect(() => validator(withoutPassword)).toThrow();
            expect(() => validator(withBoth)).not.toThrow();
        });

        it("should set error object on confirm and return it, if their values don't match", () => {
            const form = new FormGroup({
                password: new FormControl('pass123'),
                passwordConfirm: new FormControl('pass1234')
            });

            expect(validator(form)).toEqual({ passwordMatch: true });
            expect(form.controls.passwordConfirm.hasError('passwordMatch')).toBe(true);
        });

        it('should return null if their values match', () => {
            const form = new FormGroup({
                password: new FormControl('pass123'),
                passwordConfirm: new FormControl('pass123')
            });

            expect(validator(form)).toBeNull();
        });
    });

    describe('Usage in FormGroup', () => {
        let form: FormGroup;

        beforeEach(() => {
            form = new FormGroup(
                {
                    password: new FormControl(''),
                    passwordConfirm: new FormControl('')
                },
                { validators: passwordMatchValidator }
            );
        });

        it('should validate when entered in order: password -> confirm', () => {
            form.controls['password'].setValue('pass123');
            expect(form.controls['passwordConfirm'].hasError('passwordMatch')).toBe(true);

            form.controls['passwordConfirm'].setValue('pass123');
            expect(form.controls['passwordConfirm'].hasError('passwordMatch')).toBe(
                false
            );
        });

        it('should validate when entered in reverse order', () => {
            form.controls['passwordConfirm'].setValue('pass123');
            expect(form.controls['passwordConfirm'].hasError('passwordMatch')).toBe(true);

            form.controls['password'].setValue('pass123');
            expect(form.controls['passwordConfirm'].hasError('passwordMatch')).toBe(
                false
            );
        });
    });
});
