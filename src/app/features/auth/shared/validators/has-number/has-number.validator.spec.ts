import { FormControl } from '@angular/forms';
import { hasNumberValidator } from './has-number.validator';

fdescribe('PasswordMatch Validator', () => {
    const validator = hasNumberValidator;

    it('should throw if the controls type is not a string', () => {
        const invalid = new FormControl({});
        const valid = new FormControl('');

        expect(() => validator(invalid)).toThrow();
        expect(() => validator(valid)).not.toThrow();
    });

    it('should return error object if it contains no numbers', () => {
        const empty = new FormControl('');
        const noNumbers = new FormControl('test');

        expect(validator(empty)).toEqual({ hasNumber: true });
        expect(validator(noNumbers)).toEqual({ hasNumber: true });
    });

    it('should return null on at least one number', () => {
        const oneNumber = new FormControl('test1');
        const multipleNumbers = new FormControl('t1e2s3t');

        expect(validator(oneNumber)).toBeNull();
        expect(validator(multipleNumbers)).toBeNull();
    });
});
