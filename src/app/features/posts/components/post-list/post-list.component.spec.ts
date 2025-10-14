import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PostListComponent } from './post-list.component';

describe('PostListComponent', () => {
    let component: PostListComponent;
    let fixture: ComponentFixture<PostListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PostListComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(PostListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
