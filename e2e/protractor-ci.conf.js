// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// See https://medium.com/ramsatt/gitlab-ci-cd-with-angular-7-firebase-779bf040bb82
const config = require('./protractor.conf').config;
const puppeteer = require('puppeteer');

// Existing capabilities include `browserName: 'chrome'`
config.capabilities.chromeOptions = {
  args: ['--headless', '--no-sandbox'],
  binary: puppeteer.executablePath(),
};

exports.config = config;
