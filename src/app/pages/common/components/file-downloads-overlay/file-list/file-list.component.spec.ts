import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileList } from './file-list.component';
import { MessageAttachment } from 'api';

describe('FileList Component', () => {
    let fixture: ComponentFixture<FileList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileList]
        })
            .overrideComponent(FileList, {
                set: {
                    template: '<h3>{{ header() }}</h3><span class="count">{{ files().length }}</span>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(FileList);
        fixture.componentRef.setInput('header', 'Attachments');
        fixture.componentRef.setInput('files', [{ name: 'a.txt' } as MessageAttachment]);
        fixture.detectChanges();
    });

    it('renders the header and file count', () => {
        const header = fixture.nativeElement.querySelector('h3');
        const count = fixture.nativeElement.querySelector('.count');
        expect(header?.textContent?.trim()).toBe('Attachments');
        expect(count?.textContent?.trim()).toBe('1');
    });
});
