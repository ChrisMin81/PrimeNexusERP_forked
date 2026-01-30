import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInput } from './search-input.component';

describe('SearchInput', () => {
    let fixture: ComponentFixture<SearchInput>;
    let component: SearchInput;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchInput]
        })
            .overrideComponent(SearchInput, {
                set: {
                    template: '<input type="text" (input)="onInput($event)" />'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(SearchInput);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('emits trimmed input values', () => {
        const emitted: string[] = [];
        component.valueChange.subscribe((value) => emitted.push(value));

        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = '  hello  ';
        input.dispatchEvent(new Event('input'));

        expect(emitted).toEqual(['hello']);
    });

    it('emits empty string for non-input targets', () => {
        const emitted: string[] = [];
        component.valueChange.subscribe((value) => emitted.push(value));

        component.onInput(new Event('input'));

        expect(emitted).toEqual(['']);
    });

    it('clears value on cleared event', () => {
        const emitted: string[] = [];
        component.valueChange.subscribe((value) => emitted.push(value));

        component.onCleared();

        expect(emitted).toEqual(['']);
    });
});

