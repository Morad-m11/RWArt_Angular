import { TypedValidationErrorMessages } from './validation-types';

export const ValidationMessages: TypedValidationErrorMessages = {
    required: 'Field is required',
    requiredtrue: 'Required to be set',
    pattern: 'Mismatching pattern',
    unique: 'Already exists',
    email: 'Email is invalid',
    serverCheck: (status) => `Server check failed (${status})`,
    passwordMatch: 'Passwords do not match',
    min: () => 'min',
    minlength: ({ actualLength, requiredLength }) => `${actualLength}/${requiredLength}`,
    max: () => 'min',
    maxlength: ({ actualLength, requiredLength }) => `${actualLength}/${requiredLength}`
};
