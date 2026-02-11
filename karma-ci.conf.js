// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// See https://medium.com/ramsatt/gitlab-ci-cd-with-angular-7-firebase-779bf040bb82
const puppeteer = require("puppeteer");
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "../coverage/donate-frontend"),
      reporters: [{ type: "html" }, { type: "lcovonly" }, { type: "text-summary" }],
      fixWebpackSourcePaths: true,
    },
    files: ["./src/assets/custom-libs/modernizr.js"],
    // Use a console-friendly reporter in CI
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    // Keep timeouts robust for headless Chrome in CI
    // Increase timeouts to avoid flaky disconnects in headless Chrome on CI
    browserNoActivityTimeout: 120000,
    captureTimeout: 120000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browsers: ["Chrome"],
    // See https://medium.com/ramsatt/gitlab-ci-cd-with-angular-7-firebase-779bf040bb82
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    singleRun: true,
    restartOnFileChange: false,
    proxies: { "/matomo.js": "" },
  });
};
