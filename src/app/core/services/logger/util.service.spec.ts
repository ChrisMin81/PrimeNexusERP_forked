import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { vi } from 'vitest';
import { createSpyObj, type SpyObj } from '@/testing/spy';
import { UtilService } from './util.service';

describe('UtilService', () => {
    let service: UtilService;
    let sanitizer: SpyObj<DomSanitizer>;

    let safeUrl: SafeResourceUrl;

    beforeEach(() => {
        sanitizer = createSpyObj<DomSanitizer>(['sanitize', 'bypassSecurityTrustResourceUrl']);
        safeUrl = 'safe-url' as unknown as SafeResourceUrl;
        sanitizer.bypassSecurityTrustResourceUrl.mockReturnValue(safeUrl);
        sanitizer.sanitize.mockReturnValue('safe-url');

        TestBed.configureTestingModule({
            providers: [
                UtilService,
                { provide: DomSanitizer, useValue: sanitizer }
            ]
        });

        service = TestBed.inject(UtilService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('creates a blob URL and opens it when sanitized', () => {
        const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
        openSpy.mockClear();
        const urlSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');

        service.downloadCSV([{ message: 'm', status: 500, url: '/api' }]);

        expect(urlSpy).toHaveBeenCalled();
        expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('blob:url');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.RESOURCE_URL, safeUrl);
        expect(openSpy).toHaveBeenCalledWith('safe-url');
    });

    it('does not open a window when sanitize returns null', () => {
        sanitizer.sanitize.mockReturnValueOnce(null);
        const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

        service.downloadCSV([{ message: 'm', status: 500, url: '/api' }]);

        expect(openSpy).not.toHaveBeenCalled();
    });
});
