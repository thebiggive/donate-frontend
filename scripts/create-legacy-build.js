#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const DIST_DIR = "dist/donate-frontend";
const BROWSER_DIR = path.join(DIST_DIR, "browser");
const BROWSER_ES5_DIR = path.join(DIST_DIR, "browser-es5");

console.log("Creating ES5-compatible build...");

// Step 1: Copy the entire browser directory to browser-es5
if (fs.existsSync(BROWSER_ES5_DIR)) {
  fs.rmSync(BROWSER_ES5_DIR, { recursive: true, force: true });
}

console.log("Copying browser build to browser-es5...");
execSync(`cp -r "${BROWSER_DIR}" "${BROWSER_ES5_DIR}"`);

// Step 2: Transpile all JS files with babel
console.log("Transpiling JavaScript files with babel...");
execSync(`babel "${BROWSER_ES5_DIR}" --out-dir "${BROWSER_ES5_DIR}" --extensions ".js" --verbose`);

// Step 3: Update HTML files to reference the transpiled JS files
console.log("Updating HTML file script references...");

function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Update script src attributes to point to ES5 bundle path
  content = content.replace(/src="\/d\//g, 'src="/d-es5/');

  // Update link href attributes for CSS files to point to ES5 bundle path
  content = content.replace(/href="\/d\//g, 'href="/d-es5/');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

// Update all HTML files in the browser-es5 directory
const htmlFiles = fs
  .readdirSync(BROWSER_ES5_DIR)
  .filter((file) => file.endsWith(".html"))
  .map((file) => path.join(BROWSER_ES5_DIR, file));

htmlFiles.forEach(updateHtmlFile);

console.log("ES5 build creation complete!");
console.log(`Modern build: ${BROWSER_DIR}`);
console.log(`Legacy build: ${BROWSER_ES5_DIR}`);
