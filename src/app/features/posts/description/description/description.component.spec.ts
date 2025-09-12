import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setInputs } from 'src/app/shared/test/set-inputs';
import { Post } from '../../shared/post.interface';
import { DescriptionComponent } from './description.component';

const POST: Post = {
    id: '1',
    title: 'title',
    description: 'description',
    author: { username: 'me' },
    imageId: '1',
    imageUrl: 'image url',
    upvoted: false,
    upvoteCount: 1
};

describe('DescriptionComponent', () => {
    let component: DescriptionComponent;
    let fixture: ComponentFixture<DescriptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DescriptionComponent]
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
