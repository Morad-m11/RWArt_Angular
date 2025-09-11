import { HttpResourceRef } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService, UserInfo } from 'src/app/core/services/auth/auth.service';
import { provideValue } from 'src/app/shared/provide';
import ProfileComponent from './profile.component';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileComponent],
            providers: [
                provideValue(AuthService, {
                    me: {
                        value: () => ({
                            id: 1,
                            username: 'name',
                            email: 'email',
                            picture: 'picture'
                        })
                    } as HttpResourceRef<UserInfo>
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
