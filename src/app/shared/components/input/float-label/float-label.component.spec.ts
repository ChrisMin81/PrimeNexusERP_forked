import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloatLabelComponent } from './float-label.component';
import { BaseInputComponent } from '../base-input.component';

@Component({
    template: `
        <app-float-label [label]="label" [forId]="forId">
            <app-base-input [id]="inputId"></app-base-input>
        </app-float-label>
    `,
    imports: [FloatLabelComponent, BaseInputComponent]
})
class FloatLabelHostComponent {
    label = 'Email';
    forId: string | undefined = undefined;
    inputId = 'email-input';
}

describe('FloatLabelComponent', () => {
    let fixture: ComponentFixture<FloatLabelHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FloatLabelHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FloatLabelHostComponent);
        fixture.detectChanges();
    });

    it('uses the child input id when forId is not provided', () => {
        const component = fixture.debugElement.children[0].componentInstance as FloatLabelComponent;
        expect(component.labelFor()).toBe('email-input');
    });

    it('prefers the provided forId over the child input id', () => {
        fixture.componentInstance.forId = 'manual-id';
        fixture.detectChanges();

        const component = fixture.debugElement.children[0].componentInstance as FloatLabelComponent;
        expect(component.labelFor()).toBe('manual-id');
    });
});
