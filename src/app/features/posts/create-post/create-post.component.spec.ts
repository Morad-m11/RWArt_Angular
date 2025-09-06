import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { provideValue } from 'src/app/shared/provide';
import { PostsService } from '../services/posts.service';
import { CreatePostComponent } from './create-post.component';

describe('CreatePostComponent', () => {
    let component: CreatePostComponent;
    let fixture: ComponentFixture<CreatePostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreatePostComponent],
            providers: [provideValue(SnackbarService), provideValue(PostsService)]
        }).compileComponents();

        fixture = TestBed.createComponent(CreatePostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
