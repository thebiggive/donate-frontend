import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-video',
  styleUrl: 'biggive-video.scss',
  shadow: true,
})
export class BiggiveVideo {
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
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="video-wrap">
          <video controls src={this.videoUrl} />
        </div>
      </div>
    );
  }
}
