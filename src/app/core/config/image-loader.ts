import {
    IMAGE_LOADER,
    ImageLoaderConfig,
    provideCloudinaryLoader
} from '@angular/common';
import { isDevMode, Provider } from '@angular/core';
import { CLOUDINARY_CLIENT_ID } from 'src/app/constants';

const provideImageLoaderMock = (path: string): Provider[] => {
    const loaderFn = ({ width }: ImageLoaderConfig) => {
        const params = width ? `/${width}/${width}` : '';
        return `${path}/${params}`;
    };

    return [{ provide: IMAGE_LOADER, useValue: loaderFn }];
};

export const provideImageLoader = (): Provider[] => {
    return isDevMode()
        ? provideImageLoaderMock('https://picsum.photos/id/237')
        : provideCloudinaryLoader(`https://res.cloudinary.com/${CLOUDINARY_CLIENT_ID}`);
};
