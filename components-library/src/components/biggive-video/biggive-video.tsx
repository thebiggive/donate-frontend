import { Component, Prop, h } from '@stencil/core';
import { VideoService } from '../../util/video';

@Component({
  tag: 'biggive-video',
  styleUrl: 'biggive-video.scss',
  shadow: true,
})
export class BiggiveVideo {
  /**
   * Space above component
   */
  @Prop() spaceAbove: number = 0;
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Full URL of a video.
   */
  @Prop() videoUrl: string = '';

  render() {
    return (
      <div class={'container space-above-' + this.spaceAbove + ' space-below-' + this.spaceBelow}>
        <div class="video-wrap" innerHTML={VideoService.getEmbedHtml(this.videoUrl)}></div>
      </div>
    );
  }
}
