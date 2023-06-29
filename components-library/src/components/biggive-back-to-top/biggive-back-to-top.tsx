import { Component, getAssetPath, h } from '@stencil/core';

@Component({
  tag: 'biggive-back-to-top',
  styleUrl: 'biggive-back-to-top.scss',
  shadow: true,
})
export class BiggiveBackToTop {
  render() {
    return (
      <div class="container">
        <a href="#">
          <img src={getAssetPath('../assets/images/triangles-combined.svg')} />
          <span class="text">Back to top</span>
        </a>
      </div>
    );
  }
}
