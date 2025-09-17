#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define paths
const DIST_DIR = "dist/donate-frontend";
const BROWSER_ES5_DIR = path.join(DIST_DIR, "browser-es5");

console.log("Testing ES5 build process...");

// Run the build script
try {
  console.log("Running create-legacy-build.js...");
  execSync('node scripts/create-legacy-build.js', { stdio: 'inherit' });

  // Check if the browser-es5 directory exists
  if (fs.existsSync(BROWSER_ES5_DIR)) {
    console.log(`✅ ${BROWSER_ES5_DIR} directory created successfully.`);

    // Check for JS files
    const jsFiles = fs.readdirSync(BROWSER_ES5_DIR)
      .filter(file => file.endsWith('.js'));

    if (jsFiles.length > 0) {
      console.log(`✅ Found ${jsFiles.length} JavaScript files in ${BROWSER_ES5_DIR}.`);

      // Check content of a JS file to ensure it doesn't contain require() statements
      const sampleFile = path.join(BROWSER_ES5_DIR, jsFiles[0]);
      const content = fs.readFileSync(sampleFile, 'utf8');

      if (!content.includes('require(')) {
        console.log(`✅ No 'require()' statements found in ${jsFiles[0]}.`);
      } else {
        console.log(`❌ 'require()' statements still present in ${jsFiles[0]}.`);
      }
    } else {
      console.log(`❌ No JavaScript files found in ${BROWSER_ES5_DIR}.`);
    }

    // Check for HTML files
    const htmlFiles = fs.readdirSync(BROWSER_ES5_DIR)
      .filter(file => file.endsWith('.html'));

    if (htmlFiles.length > 0) {
      console.log(`✅ Found ${htmlFiles.length} HTML files in ${BROWSER_ES5_DIR}.`);

      // Check if HTML files have been updated to use /d-es5/ paths
      const sampleHtml = path.join(BROWSER_ES5_DIR, htmlFiles[0]);
      const htmlContent = fs.readFileSync(sampleHtml, 'utf8');

      if (htmlContent.includes('src="/d-es5/')) {
        console.log(`✅ HTML files updated to use /d-es5/ paths.`);
      } else {
        console.log(`❌ HTML files not updated to use /d-es5/ paths.`);
      }
    } else {
      console.log(`❌ No HTML files found in ${BROWSER_ES5_DIR}.`);
    }
  } else {
    console.log(`❌ ${BROWSER_ES5_DIR} directory not created.`);
  }

  console.log("Test completed.");
} catch (error) {
  console.error("Error during test:", error);
}
