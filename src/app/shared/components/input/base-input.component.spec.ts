import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseInputComponent } from './base-input.component';

describe('BaseInputComponent', () => {
    let fixture: ComponentFixture<BaseInputComponent>;
    let component: BaseInputComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BaseInputComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BaseInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('clears the value and emits cleared', () => {
        const emitted: number[] = [];
        component.cleared.subscribe(() => emitted.push(1));
        component.value.set('hello');

        component.clearValue();

        expect(component.value()).toBe('');
        expect(emitted).toEqual([1]);
    });

    it('shows the clear button when clearable and value is set', () => {
        fixture.componentRef.setInput('clearable', true);
        component.value.set('hello');
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('.clear-button');
        expect(button).toBeTruthy();
    });
});
