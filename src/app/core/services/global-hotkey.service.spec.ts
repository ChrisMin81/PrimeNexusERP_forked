import { TestBed } from '@angular/core/testing';
import { GlobalHotkeyService } from './global-hotkey.service';

describe('GlobalHotkeyService', () => {
    let service: GlobalHotkeyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GlobalHotkeyService);
    });

    it('emits on Ctrl+F and prevents default', (done) => {
        const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, cancelable: true });

        const sub = service.ctrlF$.subscribe(() => {
            expect(event.defaultPrevented).toBeTrue();
            sub.unsubscribe();
            done();
        });

        document.dispatchEvent(event);
    });
});
