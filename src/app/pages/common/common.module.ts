import { NgModule } from '@angular/core';
import { FileDownloadsOverlay } from './components/attachments-overlay/file-downloads-overlay.component';
import { SearchInput } from './components/search-input/search-input';

@NgModule({
  imports: [SearchInput, FileDownloadsOverlay],
  exports: [SearchInput, FileDownloadsOverlay],
})
export class CommonComponentsModule {}
