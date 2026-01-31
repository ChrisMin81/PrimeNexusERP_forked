import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloatLabelInput } from './float-label-input.component';

@Component({
    template: '<app-float-label-input [label]="label" (cleared)="cleared = true"></app-float-label-input>',
    imports: [FloatLabelInput]
})
class HostComponent {
    label = 'Email';
    cleared = false;
}

describe('FloatLabelInput Component', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent]
        })
            .overrideComponent(FloatLabelInput, {
                set: {
                    template: '<button class="clear" (click)="cleared.emit()">Clear</button>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('emits cleared when cleared', () => {
        const button = fixture.nativeElement.querySelector('.clear') as HTMLButtonElement | null;
        button?.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.cleared).toBe(true);
    });
});
