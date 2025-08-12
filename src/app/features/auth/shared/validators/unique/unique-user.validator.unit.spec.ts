import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';
import {
    ASYNC_VALIDATION_DELAY,
    asyncUniqueUserValidator
} from './unique-user.validator';

describe('UniqueValidator Unit Test', () => {
    let control: AbstractControl<string>;
    let isUniqueMock: jest.MockedFn<UserService['isUnique']>;

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        isUniqueMock = jest.fn();

        const userServiceMock = {
            isUnique: isUniqueMock
        } as unknown as UserService;

        const validator = asyncUniqueUserValidator(userServiceMock, 'username');
        control = new FormControl('', { nonNullable: true, asyncValidators: validator });
    });

    describe('Service validation call', () => {
        it('should call after a delay', async () => {
            control.setValue('value');
            expect(isUniqueMock).not.toHaveBeenCalled();

            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(isUniqueMock).toHaveBeenCalledTimes(1);
        });

        it('should call on changed values', async () => {
            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(isUniqueMock).toHaveBeenCalledTimes(1);

            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(isUniqueMock).toHaveBeenCalledTimes(1);

            control.setValue('changed value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(isUniqueMock).toHaveBeenCalledTimes(2);
        });

        it('should call with the control name and value', async () => {
            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(isUniqueMock).toHaveBeenCalledWith({ username: 'value' });
        });
    });

    describe('Responses', () => {
        it('should return the same response as before on unchanged values (distinct check)', async () => {
            isUniqueMock.mockResolvedValue(true);

            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(control.errors).toEqual(null);

            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);
            expect(control.errors).toEqual(null);
        });

        it('should return null if the response is "true"', async () => {
            isUniqueMock.mockResolvedValue(true);

            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);

            expect(control.errors).toEqual(null);
        });

        it('should return a "unique" property if the response is "false"', async () => {
            isUniqueMock.mockResolvedValue(false);

            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);

            expect(control.errors).toEqual({ unique: false });
        });

        it('should return a "check failed" property if the request fails', async () => {
            isUniqueMock.mockRejectedValue(new HttpErrorResponse({ status: 404 }));

            control.setValue('value');
            await jest.advanceTimersByTimeAsync(ASYNC_VALIDATION_DELAY);

            expect(control.errors).toEqual({ serverCheck: 404 });
        });
    });
});
