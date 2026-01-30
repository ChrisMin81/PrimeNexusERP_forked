import { Injectable, isDevMode } from '@angular/core';

interface LoggingFunction {
    (...args: unknown[]): void;
}
export interface Logger {
    info: LoggingFunction;
    log: LoggingFunction;
    warn: LoggingFunction;
    error: LoggingFunction;
}

/**
 * LoggerService is a utility class that provides logging functionalities
 * to output various levels of log information. It functions only when the
 * application is in development mode.
 *
 * The service supports several logging methods, including debug, info,
 * log, warn, and error. These methods allow for granular control and categorization
 * of logs based on severity. Additionally, the `error` method includes logic
 * to download error details as a CSV file using the UtilService.
 *
 * This service is designed to be injectable and follows a singleton pattern
 * by being registered at the root level of the dependency injection system.
 *
 * @implements {Logger}
 */
@Injectable({ providedIn: 'root' })
export class LoggerService implements Logger {
    trace(...args: unknown[]): void {
        if (isDevMode()) {
            console.trace.apply(null, args);
        }
    }
    debug(...args: unknown[]): void {
        if (isDevMode()) {
            console.trace.apply(null, args);
        }
    }

    log(...args: unknown[]): void {
        if (isDevMode()) {
            console.log.apply(null, args);
        }
    }

    info(...args: unknown[]): void {
        if (isDevMode()) {
            console.info.apply(null, args);
        }
    }

    warn(...args: unknown[]): void {
        if (isDevMode()) {
            console.warn.apply(null, args);
        }
    }

    error(...args: unknown[]): void {
        if (isDevMode()) {
            console.log('Error =>>>>');
            console.error.apply(null, args);
        }
    }
}
