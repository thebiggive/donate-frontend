import { Pipe, PipeTransform } from '@angular/core';

import { ImageService } from './image.service';

@Pipe({
  name: 'optimisedImage',
  standalone: true,
})
export class OptimisedImagePipe implements PipeTransform {
  constructor(private imageService: ImageService) {}

  transform(originalUri: string | null, width: number = 830): Promise<string|null> {
    return new Promise((resolve, reject) => {
      this.imageService.getImageUri(originalUri, width)
        .subscribe({
          next: uri => resolve(uri),
          error: error => reject(error)
        });
    });
  }
}
