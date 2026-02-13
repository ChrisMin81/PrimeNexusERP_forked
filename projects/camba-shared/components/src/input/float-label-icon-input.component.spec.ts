import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FloatLabelIconInputComponent } from 'camba-shared/components';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('FloatLabelIconInputComponent', () => {
    let component: FloatLabelIconInputComponent;
    let fixture: ComponentFixture<FloatLabelIconInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FloatLabelIconInputComponent],
            providers: [provideZonelessChangeDetection(), provideAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(FloatLabelIconInputComponent);
        component = fixture.componentInstance;

        // Required inputs for initialization
        fixture.componentRef.setInput('id', 'test-input-id');
        fixture.componentRef.setInput('label', 'Username');
        fixture.detectChanges();
    });

    describe('Label and Placeholder Logic', () => {
        it('should show p-floatLabel when variant is not "none" and label exists', () => {
            fixture.componentRef.setInput('variant', 'on');
            fixture.detectChanges();
            const floatLabel = fixture.debugElement.query(By.css('p-floatLabel'));
            expect(floatLabel).toBeTruthy();
        });

        it('should NOT show p-floatLabel when label is empty', () => {
            fixture.componentRef.setInput('label', '');
            fixture.detectChanges();
            const floatLabel = fixture.debugElement.query(By.css('p-floatLabel'));
            expect(floatLabel).toBeFalsy();
        });

        it('should suppress placeholder when FloatLabel is active to prevent "jumping"', () => {
            fixture.componentRef.setInput('variant', 'on');
            fixture.componentRef.setInput('placeholder', 'Enter text...');
            fixture.detectChanges();

            const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
            // effectivePlaceholder should return null when float label is shown
            expect(inputElement.getAttribute('placeholder')).toBeNull();
        });

        it('should allow placeholder when variant is "none"', () => {
            fixture.componentRef.setInput('variant', 'none');
            fixture.componentRef.setInput('placeholder', 'Enter text...');
            fixture.detectChanges();

            const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
            expect(inputElement.getAttribute('placeholder')).toBe('Enter text...');
        });
    });

    describe('Icon Rendering', () => {
        it('should render icon on the left by default', () => {
            fixture.componentRef.setInput('icon', 'pi-user');
            fixture.detectChanges();

            const iconField = fixture.debugElement.query(By.css('p-iconfield'));
            const firstChild = iconField.nativeElement.children[0];

            expect(iconField).toBeTruthy();
            // Check if p-inputicon is the first child (left position)
            expect(firstChild.tagName.toLowerCase()).toBe('p-inputicon');
        });

        it('should render icon on the right when iconPosition is "right"', () => {
            fixture.componentRef.setInput('icon', 'pi-search');
            fixture.componentRef.setInput('iconPosition', 'right');
            fixture.detectChanges();

            const iconField = fixture.debugElement.query(By.css('p-iconfield'));
            const children = iconField.nativeElement.children;
            const lastChild = children[children.length - 1];

            // The input should be first, and icon should be last
            expect(lastChild.tagName.toLowerCase()).toBe('p-inputicon');
        });
    });

    describe('Clearable Functionality', () => {
        it('should show clear button only when clearable is true and value exists', () => {
            fixture.componentRef.setInput('clearable', true);
            component.value.set('Some data');
            fixture.detectChanges();

            let clearBtn = fixture.debugElement.query(By.css('.clear-button'));
            expect(clearBtn).toBeTruthy();

            component.value.set('');
            fixture.detectChanges();
            clearBtn = fixture.debugElement.query(By.css('.clear-button'));
            expect(clearBtn).toBeFalsy();
        });

        it('should reset value and emit cleared event when clear button is clicked', () => {
            const spy = vi.spyOn(component.cleared, 'emit');
            fixture.componentRef.setInput('clearable', true);
            component.value.set('Delete me');
            fixture.detectChanges();

            const clearBtn = fixture.debugElement.query(By.css('.clear-button'));
            clearBtn.triggerEventHandler('click', null);

            expect(component.value()).toBe('');
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('State and Styling', () => {
        it('should apply disabled attribute to input and container', async () => {
            // Update the signal input to true
            fixture.componentRef.setInput('disabled', true);

            // Trigger change detection and wait for microtasks/stability
            fixture.detectChanges();
            await fixture.whenStable();

            // Use the correct CSS attribute selector (no 'attr.' prefix)
            const container = fixture.debugElement.query(By.css('[data-disabled="true"]')).nativeElement;
            const input = fixture.debugElement.query(By.css('input')).nativeElement;

            expect(container.getAttribute('data-disabled')).toBe('true');
            expect(input.disabled).toBe(true);
        });

        it('should apply size classes correctly', () => {
            fixture.componentRef.setInput('size', 'small');
            fixture.detectChanges();
            let input = fixture.debugElement.query(By.css('input')).nativeElement;
            expect(input.classList).toContain('p-inputtext-sm');

            fixture.componentRef.setInput('size', 'large');
            fixture.detectChanges();
            expect(input.classList).toContain('p-inputtext-lg');
        });

        it('should render hint text when provided', () => {
            const hintMsg = 'Password must be 8 chars';
            fixture.componentRef.setInput('hint', hintMsg);
            fixture.detectChanges();

            const small = fixture.debugElement.query(By.css('small')).nativeElement;
            expect(small.textContent).toContain(hintMsg);
        });
    });

    describe('Focus/Blur Events', () => {
        it('should emit focused event on focus', () => {
            const spy = vi.spyOn(component.focused, 'emit');
            const input = fixture.debugElement.query(By.css('input'));
            input.triggerEventHandler('focus', new FocusEvent('focus'));
            expect(spy).toHaveBeenCalled();
        });

        it('should emit blurred event on blur', () => {
            const spy = vi.spyOn(component.blurred, 'emit');
            const input = fixture.debugElement.query(By.css('input'));
            input.triggerEventHandler('blur', new FocusEvent('blur'));
            expect(spy).toHaveBeenCalled();
        });
    });
});
