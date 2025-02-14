import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { OptimisedImagePipe } from './optimised-image.pipe';
import '../assets/custom-libs/modernizr.js';

describe('OptimisedImagePipe', () => {
  let pipe: OptimisedImagePipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageService,
      ],
    });
  });

  beforeEach(() => {
    pipe = new OptimisedImagePipe(TestBed.inject(ImageService));
  });

  it('is instantiated', () => {
    expect(pipe).toBeTruthy();
  });

  it('processes a null URI', async () => {
    expect(await pipe.transform(null, 777)).toEqual(null);
  });

  it('processes a non-null URI', async () => {
    expect(await pipe.transform('https://example.com/image.png', 777))
      .toEqual('https://example.com/image.png?width=777&format=webp'); // Modern test browsers support webp.
  });
});
