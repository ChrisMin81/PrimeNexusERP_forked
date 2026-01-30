import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog.component';

describe('ConfirmDialog Component', () => {
    let fixture: ComponentFixture<ConfirmDialog>;
    let component: ConfirmDialog;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmDialog]
        })
            .overrideComponent(ConfirmDialog, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(ConfirmDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('emits confirm when confirm action is triggered', () => {
        const emitted: boolean[] = [];
        component.confirm.subscribe(() => emitted.push(true));

        component.onConfirmClick();

        expect(emitted).toEqual([true]);
    });

    it('emits cancel on cancel action and on hide', () => {
        const emitted: number[] = [];
        component.cancel.subscribe(() => emitted.push(1));

        component.onCancelClick();
        component.onHide();

        expect(emitted).toEqual([1, 1]);
    });
});
