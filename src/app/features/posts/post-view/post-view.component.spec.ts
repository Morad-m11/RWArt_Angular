import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { setInputs } from 'src/app/shared/test/set-inputs';
import { PostViewComponent } from './post-view.component';

describe('PostViewComponent', () => {
    let component: PostViewComponent;
    let fixture: ComponentFixture<PostViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PostViewComponent],
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PostViewComponent);
        component = fixture.componentInstance;
        setInputs(fixture, { postId: '1' });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
