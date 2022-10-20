export default {
  title: 'Components/Content',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    videoUrl: {
      name: 'Video URL',
    },
  },
};

const Template = args => `
            <biggive-video
              space-below="${args.spaceBelow}"
              video-url="${args.videoUrl}">
            </biggive-video>
            `;

export const VideoComponent = Template.bind({});
VideoComponent.args = {
  spaceBelow: 4,
  videoUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
};
