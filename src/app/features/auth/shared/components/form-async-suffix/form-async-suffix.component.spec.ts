import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { setInputs } from 'src/app/shared/testing/set-inputs';
import { FormAsyncSuffixComponent } from './form-async-suffix.component';

describe('FormAsyncSuffixComponent', () => {
    let component: FormAsyncSuffixComponent;
    let fixture: ComponentFixture<FormAsyncSuffixComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormAsyncSuffixComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FormAsyncSuffixComponent);
        component = fixture.componentInstance;
        setInputs(fixture, { control: new FormControl('') });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
