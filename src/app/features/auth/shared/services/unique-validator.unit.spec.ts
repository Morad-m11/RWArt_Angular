import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl } from '@angular/forms';
import { firstValueFrom, of, throwError } from 'rxjs';
import { provideValue } from 'src/app/shared/provide';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AsyncUniqueValidator } from './unique.validator';

describe('UniqueValidator Unit Test', () => {
    let control: AbstractControl<string>;
    let validator: AsyncUniqueValidator;
    let isUniqueMock: jest.MockedFn<UserService['isUnique']>;

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        isUniqueMock = jest.fn();

        TestBed.configureTestingModule({
            providers: [
                provideValue(UserService, {
                    isUnique: isUniqueMock
                })
            ]
        });

        validator = TestBed.inject(AsyncUniqueValidator);
        control = new FormControl('', { nonNullable: true });
    });

    it('should call the service validation after a delay', async () => {
        firstValueFrom(validator.validate(control));
        control.setValue('value');
        expect(isUniqueMock).not.toHaveBeenCalled();

        await jest.advanceTimersToNextTimerAsync();
        expect(isUniqueMock).toHaveBeenCalledWith('value');
    });

    it('should call the service validation on changed values', async () => {
        await changeValue('value');
        expect(isUniqueMock).toHaveBeenCalledTimes(1);

        await changeValue('value');
        expect(isUniqueMock).toHaveBeenCalledTimes(1);

        await changeValue('changed value');
        expect(isUniqueMock).toHaveBeenCalledTimes(2);
    });

    it('should return null if the response is "true"', async () => {
        isUniqueMock.mockReturnValue(of(true));

        const result = await changeValue('value');

        expect(result).toBeNull();
    });

    it('should return a "unique" property if the response is "false"', async () => {
        isUniqueMock.mockReturnValue(of(false));

        const result = await changeValue('value');

        expect(result).toEqual({ unique: false });
    });

    it('should return a "check failed" property if the request fails', async () => {
        isUniqueMock.mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 404 }))
        );

        const result = await changeValue('value');

        expect(result).toEqual({ serverCheck: 404 });
    });

    async function changeValue(value: string): typeof promise {
        control.setValue(value);

        const promise = firstValueFrom(validator.validate(control));
        jest.advanceTimersToNextTimer();
        return await promise;
    }
});
