import { InputSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

type RemoveNever<T> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K];
};

type ExtractedInputs<T> = {
    [K in keyof T]: T[K] extends InputSignal<infer R> ? R : never;
};

type FilteredInputs<T> = RemoveNever<ExtractedInputs<T>>;

type ComponentInputs<T> = Partial<FilteredInputs<T>>;

export function setInputs<T>(
    fixture: ComponentFixture<T>,
    inputs: ComponentInputs<T>
): void {
    Object.entries(inputs).forEach(([key, value]) => {
        fixture.componentRef.setInput(key, value);
    });
}
