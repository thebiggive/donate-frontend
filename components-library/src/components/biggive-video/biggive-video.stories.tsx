export default {
  title: 'Components/Content',
  argTypes: {
    spaceAbove: {
      name: 'Space above',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
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
              space-above="${args.spaceAbove}"
              space-below="${args.spaceBelow}"
              video-url="${args.videoUrl}">
            </biggive-video>
            
            `;

export const VideoComponent = Template.bind({});
VideoComponent.args = {
  spaceAbove: 4,
  spaceBelow: 4,
  videoUrl: 'https://www.youtube.com/embed/Ru4vGXMavf4',
};
