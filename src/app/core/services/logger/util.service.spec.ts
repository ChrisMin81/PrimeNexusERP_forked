import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { UtilService } from './util.service';

describe('UtilService', () => {
    let service: UtilService;
    let sanitizer: jasmine.SpyObj<DomSanitizer>;

    beforeEach(() => {
        sanitizer = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['sanitize', 'bypassSecurityTrustResourceUrl']);
        sanitizer.bypassSecurityTrustResourceUrl.and.returnValue('safe-url' as any);
        sanitizer.sanitize.and.returnValue('safe-url');

        TestBed.configureTestingModule({
            providers: [
                UtilService,
                { provide: DomSanitizer, useValue: sanitizer }
            ]
        });

        service = TestBed.inject(UtilService);
    });

    it('creates a blob URL and opens it when sanitized', () => {
        const openSpy = spyOn(window, 'open').and.stub();
        const urlSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');

        service.downloadCSV([{ message: 'm', status: 500, url: '/api' }]);

        expect(urlSpy).toHaveBeenCalled();
        expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('blob:url');
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.RESOURCE_URL, 'safe-url' as any);
        expect(openSpy).toHaveBeenCalledWith('safe-url');
    });

    it('does not open a window when sanitize returns null', () => {
        sanitizer.sanitize.and.returnValue(null);
        const openSpy = spyOn(window, 'open').and.stub();

        service.downloadCSV([{ message: 'm', status: 500, url: '/api' }]);

        expect(openSpy).not.toHaveBeenCalled();
    });
});
