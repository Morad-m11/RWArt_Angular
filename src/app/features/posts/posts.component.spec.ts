import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { renderAllDeferBlocks } from '../../shared/test/defer';
import { FeaturedComponent } from './components/featured/featured.component';
import { PostsComponent } from './posts.component';

describe('PostsComponent', () => {
    let component: PostsComponent;
    let fixture: ComponentFixture<PostsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PostsComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ],
            deferBlockBehavior: DeferBlockBehavior.Manual
        })
            .overrideComponent(PostsComponent, {
                remove: { imports: [FeaturedComponent] },
                add: { imports: [FeaturedComponentMock] }
            })
            .compileComponents();

        fixture = TestBed.createComponent(PostsComponent);
        component = fixture.componentInstance;
        await renderAllDeferBlocks(fixture);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({ selector: 'app-featured' })
class FeaturedComponentMock {}
