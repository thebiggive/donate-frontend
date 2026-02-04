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
      require("@angular/build/karma"),
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
    reporters: ["kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
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
