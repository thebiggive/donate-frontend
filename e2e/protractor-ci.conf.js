// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// See https://medium.com/ramsatt/gitlab-ci-cd-with-angular-7-firebase-779bf040bb82
const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox'],
  }
};

exports.config = config;
