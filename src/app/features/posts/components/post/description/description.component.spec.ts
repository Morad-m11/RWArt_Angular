import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideValue } from 'src/app/shared/provide';
import { setInputs } from 'src/app/shared/test/set-inputs';
import { PostsService } from '../../../services/posts.service';
import { Post } from '../../../shared/post.interface';
import { DescriptionComponent } from './description.component';

const POST: Post = {
    id: '1',
    title: 'title',
    description: 'description',
    author: { username: 'me' },
    tags: [],
    imageId: '1',
    imageUrl: 'image url',
    upvoteCount: 1,
    isUpvoted: false,
    isOwner: false
};

describe('DescriptionComponent', () => {
    let component: DescriptionComponent;
    let fixture: ComponentFixture<DescriptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DescriptionComponent],
            providers: [provideValue(PostsService), provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(DescriptionComponent);
        component = fixture.componentInstance;
        setInputs(fixture, { post: POST });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
