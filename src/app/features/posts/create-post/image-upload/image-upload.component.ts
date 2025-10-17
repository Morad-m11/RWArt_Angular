import { Component, computed, signal } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';

const MAX_FILE_SIZE_BYTES = 10 * 1e6;

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [MaterialModule, IconTextComponent],
    templateUrl: './image-upload.component.html',
    styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
    readonly acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    file = signal<File | null>(null);
    fileSize = computed(() =>
        this.file() ? this.getFileSizeText(this.file()!.size) : null
    );
    filePreviewUrl = computed(() =>
        this.file() ? URL.createObjectURL(this.file()!) : null
    );
    maxFileSize = signal(this.getFileSizeText(MAX_FILE_SIZE_BYTES));
    errorMessage = signal('');
    isDragging = signal(false);

    uploaded = outputFromObservable<File | null>(toObservable(this.file));

    onDragOver($event: DragEvent) {
        $event.preventDefault();
        this.isDragging.set(true);
    }

    onDragLeave($event: DragEvent) {
        $event.preventDefault();
        this.isDragging.set(false);
    }

    onFileDropped(event: DragEvent, input: HTMLInputElement) {
        event.preventDefault();
        this.isDragging.set(false);

        const files = event.dataTransfer?.files;
        const file = files?.item(0) ?? null;

        this.validateAndUpload(file, input);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.item(0) ?? null;

        this.validateAndUpload(file, input);
    }

    validateAndUpload(file: File | null, input: HTMLInputElement) {
        this.errorMessage.set('');

        const result = this.validateFile(file);

        if (!result.valid) {
            this.removeFile(input);
            this.errorMessage.set(result.error);
            return;
        }

        this.file.set(file);
    }

    validateFile(file: File | null): { valid: boolean; error: string } {
        if (!file) {
            return { valid: false, error: 'Invalid file' };
        }

        if (!this.acceptedFileTypes.includes(file.type)) {
            return { valid: false, error: 'Invalid file type' };
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            return { valid: false, error: 'File is too large' };
        }

        return { valid: true, error: '' };
    }

    getFileSizeText(bytes: number): string {
        if (bytes < 1e3) {
            return `${bytes} bytes`;
        }

        if (bytes >= 1e3 && bytes < 1e6) {
            return `${(bytes / 1e3).toFixed(1)} KB`;
        }

        return `${(bytes / 1e6).toFixed(1)} MB`;
    }

    removeFile(input: HTMLInputElement) {
        input.value = '';
        this.file.set(null);
    }
}
