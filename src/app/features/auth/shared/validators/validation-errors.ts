import { TypedValidationErrorMessages } from './validation-types';

export const ValidationMessages: TypedValidationErrorMessages = {
    required: 'Field is required',
    requiredtrue: 'Required to be set',
    pattern: 'Mismatching pattern',
    unique: 'Already exists',
    email: 'Email is invalid',
    hasNumber: 'Must contain a number',
    serverCheck: (status) => `Server check failed (${status})`,
    passwordMatch: 'Passwords do not match',
    min: ({ requiredLength }) => `Must not be less than ${requiredLength}`,
    max: ({ requiredLength }) => `Must not be larger than ${requiredLength}`,
    minlength: ({ actualLength, requiredLength }) =>
        `Must contain at least ${requiredLength} characters. Current: ${actualLength}`,
    maxlength: ({ actualLength, requiredLength }) =>
        `Must not contain more than ${requiredLength} characters. Current: ${actualLength}`
};
