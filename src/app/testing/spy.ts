import { vi, type Mock } from 'vitest';

export type SpyObj<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? Mock : T[K];
};

export function createSpyObj<T extends object>(keys: Array<keyof T>): SpyObj<T> {
    const spy = {} as Record<string, Mock>;

    keys.forEach((key) => {
        spy[String(key)] = vi.fn();
    });

    return spy as SpyObj<T>;
}
