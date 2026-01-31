import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { GlobalHotkeyService } from './global-hotkey.service';

describe('GlobalHotkeyService', () => {
    let service: GlobalHotkeyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GlobalHotkeyService);
    });

    it('emits on Ctrl+F and prevents default', async () => {
        const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, cancelable: true });
        const nextEvent = firstValueFrom(service.ctrlF$);
        document.dispatchEvent(event);
        await nextEvent;
        expect(event.defaultPrevented).toBe(true);
    });
});
