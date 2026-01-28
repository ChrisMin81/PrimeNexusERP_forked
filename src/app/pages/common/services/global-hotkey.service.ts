import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, filter, map, share, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalHotkeyService {
    private document = inject(DOCUMENT);

    /**
     * Emits whenever Ctrl+F is pressed; prevents the browser find dialog.
     */
    readonly ctrlF$ = fromEvent<KeyboardEvent>(this.document, 'keydown', { passive: false, capture: true }).pipe(
        filter((event) => (event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === 'F' || event.code === 'KeyF')),
        tap((event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
        }),
        map(() => void 0),
        share()
    );
}
