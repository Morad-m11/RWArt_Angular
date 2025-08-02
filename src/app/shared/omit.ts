/**
 * Emit certain properties of an object
 */
export const omit = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): T => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key as K))
    ) as T;
};
