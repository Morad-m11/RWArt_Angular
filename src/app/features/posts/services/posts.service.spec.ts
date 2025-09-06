import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PostsService } from './posts.service';

describe('PostsService', () => {
    let service: PostsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(PostsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
