import { Component, computed, effect, output, signal } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';

const MAX_FILE_SIZE_BYTES = 10 * 1e6;

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './image-upload.component.html',
    styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
    readonly acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

    image = signal<File | null>(null);
    errorMessage = signal('');
    maxFileSize = signal(this.getFileSizeText(MAX_FILE_SIZE_BYTES));
    fileSize = computed(() =>
        this.image() ? this.getFileSizeText(this.image()!.size) : null
    );

    uploaded = output<File | null>();

    constructor() {
        effect(() => {
            this.uploaded.emit(this.image());
        });
    }

    onFileUpload($event: Event) {
        const input = $event.target as HTMLInputElement;
        const file = input.files?.item(0) ?? null;

        const result = this.validateImageFile(file);

        if (!result.valid) {
            this.clearFile(input);
            this.errorMessage.set(result.error);
            return;
        }

        this.image.set(file);
    }

    validateImageFile(file: File | null): { valid: boolean; error: string } {
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

    clearFile(input: HTMLInputElement) {
        input.value = '';
        this.image.set(null);
    }
}
