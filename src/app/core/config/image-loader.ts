import {
    IMAGE_LOADER,
    ImageLoaderConfig,
    provideCloudinaryLoader
} from '@angular/common';
import { isDevMode, Provider } from '@angular/core';
import { CLOUDINARY_CLIENT_ID } from 'src/app/constants';

const provideImageLoaderMock = () => {
    return ({ width }: ImageLoaderConfig) => {
        return `https://picsum.photos/${width}/${width}`;
    };
};

export const provideImageLoader = (): Provider => {
    return {
        provide: IMAGE_LOADER,
        useFactory: () =>
            isDevMode()
                ? provideImageLoaderMock()
                : provideCloudinaryLoader(
                      `https://res.cloudinary.com/${CLOUDINARY_CLIENT_ID}`
                  )
    };
};
