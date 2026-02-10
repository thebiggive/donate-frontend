#!/usr/bin/env node

const env = process.env;

const shortCommitHash = env.CIRCLE_SHA1.substring(0, 7);

const response = await fetch("https://slack.com/api/chat.postMessage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + env.SLACK_ACCESS_TOKEN,
  },
  body: JSON.stringify({
    channel: "deployments",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `*${env.CIRCLE_BRANCH}: Donate frontend deployed!* All visitors should see the updated app version now.\n` +
            `<https://github.com/thebiggive/donate-frontend/commit/${shortCommitHash}|${shortCommitHash}: ${env.COMMIT_MESSAGE}>`,
        },
      },
    ],
  }),
});

if (!response.ok) {
  console.error(await response.body);
}
console.log(await response.body);
