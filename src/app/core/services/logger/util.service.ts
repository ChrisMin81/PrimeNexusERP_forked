import { inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class UtilService {
    private sanitizer = inject(DomSanitizer);

    downloadCSV(entries: Array<{ message: string; status: number | string; url: string | null }>) {
        /*
          type: 'application/octet-stream'
          type: 'text/csv'
          type: 'text/plain'
          type: 'text/html'
          type: 'image/jpeg'
          type: 'image/png'
          type: ''
          type: ''
        */
        console.log('===================', entries[0].message);
        const formattedData = {
            message: entries[0].message,
            status: entries[0].status,
            url: entries[0].url
        };
        const blob = new Blob([JSON.stringify(formattedData)], {
            type: 'text/html'
        });
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        const url = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
        console.log('url =>', url);
        if (url) {
            window.open(url);
        }
    }
}
