import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-image-upload',
  imports: [MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  @Input() imageSrc: string | null = null;
  @Input() expanded = true;
  @Output() imageSrcChange = new EventEmitter<string | null>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.handleFileSelection(event.dataTransfer?.files?.[0]);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(input.files?.[0]);
  }

  private handleFileSelection(file?: File) {
    if (file?.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      this.imageSrc = imageUrl;
      this.imageSrcChange.emit(imageUrl);
    }
  }

  removeImage() {
    this.imageSrc = null;
    this.imageSrcChange.emit(null);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}
