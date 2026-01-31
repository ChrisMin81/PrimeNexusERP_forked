import { TestBed } from '@angular/core/testing';
import * as core from '@angular/core';
import { vi } from 'vitest';
import { LoggerService } from './logger';

describe('LoggerService', () => {
    let service: LoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoggerService]
        });
        service = TestBed.inject(LoggerService);
    });

    it('logs based on the current dev mode', () => {
        const isDev = core.isDevMode();
        const traceSpy = vi.spyOn(console, 'trace');
        const logSpy = vi.spyOn(console, 'log');
        const infoSpy = vi.spyOn(console, 'info');
        const warnSpy = vi.spyOn(console, 'warn');
        const errorSpy = vi.spyOn(console, 'error');

        service.trace('a');
        service.debug('b');
        service.log('c');
        service.info('d');
        service.warn('e');
        service.error('f');

        if (isDev) {
            expect(traceSpy).toHaveBeenCalledTimes(2);
            expect(logSpy).toHaveBeenCalled();
            expect(infoSpy).toHaveBeenCalled();
            expect(warnSpy).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalled();
        } else {
            expect(traceSpy).not.toHaveBeenCalled();
            expect(logSpy).not.toHaveBeenCalled();
            expect(infoSpy).not.toHaveBeenCalled();
            expect(warnSpy).not.toHaveBeenCalled();
            expect(errorSpy).not.toHaveBeenCalled();
        }
    });
});
