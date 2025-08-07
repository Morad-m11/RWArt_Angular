import { ValidationErrors, ValidatorFn } from '@angular/forms';

type LengthFn = (opts: { actualLength: number; requiredLength: number }) => string;
type StatusFn = (status: number) => string;

enum Keys {
    email = 'email',
    pattern = 'pattern',
    required = 'required',
    requiredtrue = 'requiredtrue',
    passwordMatch = 'passwordMatch',
    hasNumber = 'hasNumber',
    profane = 'profane',
    unique = 'unique',
    min = 'min',
    max = 'max',
    minlength = 'minlength',
    maxlength = 'maxlength',
    serverCheck = 'serverCheck'
}

interface ArgumentMap {
    [Keys.email]: boolean;
    [Keys.pattern]: boolean;
    [Keys.required]: boolean;
    [Keys.requiredtrue]: boolean;
    [Keys.passwordMatch]: boolean;
    [Keys.hasNumber]: boolean;
    [Keys.unique]: boolean;
    [Keys.profane]: boolean;
    [Keys.min]: boolean;
    [Keys.max]: boolean;
    [Keys.minlength]: { actualLength: number; requiredLength: number };
    [Keys.maxlength]: { actualLength: number; requiredLength: number };
    [Keys.serverCheck]: number;
}

export interface TypedValidationErrorMessages {
    [Keys.email]: string;
    [Keys.pattern]: string;
    [Keys.required]: string;
    [Keys.requiredtrue]: string;
    [Keys.passwordMatch]: string;
    [Keys.hasNumber]: string;
    [Keys.unique]: string;
    [Keys.profane]: string;
    [Keys.min]: LengthFn;
    [Keys.max]: LengthFn;
    [Keys.minlength]: LengthFn;
    [Keys.maxlength]: LengthFn;
    [Keys.serverCheck]: StatusFn;
}

export type TypedValidationErrors = {
    [K in Keys]?: ArgumentMap[K];
};

/**
 * Utility that replaces the default return type of ValidationErrors with a typed object
 */
export type TypedValidatorFn = ValidatorFn extends (
    control: infer C
) => ValidationErrors | null
    ? (control: C) => TypedValidationErrors | null
    : never;
