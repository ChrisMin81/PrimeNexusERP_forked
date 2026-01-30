import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class UtilService {
    constructor(private sanitizer: DomSanitizer) {}
    downloadCSV(arr: any) {
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
        console.log('===================', arr[0].message);
        const formattedData = {
            message: arr[0].message,
            status: arr[0].status,
            url: arr[0].url
        };
        const blob = new Blob([JSON.stringify(formattedData)], {
            type: 'text/html'
        });
        const url = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob)));
        console.log('url =>', url);
        if (url) {
            window.open(url);
        }
    }
}
