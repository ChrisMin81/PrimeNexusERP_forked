import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailToolbar } from './mail-toolbar.component';

describe('MailToolbar Component', () => {
    let fixture: ComponentFixture<MailToolbar>;
    let component: MailToolbar;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MailToolbar]
        })
            .overrideComponent(MailToolbar, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(MailToolbar);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('emits refresh and compose actions', () => {
        const emitted: string[] = [];
        component.refresh.subscribe(() => emitted.push('refresh'));
        component.compose.subscribe(() => emitted.push('compose'));

        component.refresh.emit();
        component.compose.emit();

        expect(emitted).toEqual(['refresh', 'compose']);
    });

    it('emits search change', () => {
        const emitted: string[] = [];
        component.searchChange.subscribe((value) => emitted.push(value));

        component.searchChange.emit('hello');

        expect(emitted).toEqual(['hello']);
    });
});
