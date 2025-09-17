#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const process = require('process');

process.chdir(__dirname + "/..");

const DIST_DIR = "./dist/donate-frontend";
const BROWSER_DIR = path.join(DIST_DIR, "browser");
const BROWSER_ES5_DIR = path.join(DIST_DIR, "browser-es5");

console.log("Creating ES5-compatible build...");

// Step 1: Clean the browser-es5 directory if it exists
if (fs.existsSync(BROWSER_ES5_DIR)) {
  fs.rmSync(BROWSER_ES5_DIR, { recursive: true, force: true });
}

// Step 2: Create the browser-es5 directory
fs.mkdirSync(BROWSER_ES5_DIR, { recursive: true });

// Step 3: Copy non-JS assets from browser to browser-es5
console.log("Copying non-JS assets to browser-es5...");
execSync(`find "${BROWSER_DIR}" -type f -not -name "*.js" -exec cp --parents {} "${BROWSER_ES5_DIR}" \\;`);

// Step 4: Bundle JS files with webpack
console.log("Bundling JavaScript files with webpack...");
execSync("npx webpack --config webpack.es5.config.js", { stdio: 'inherit' });

// Step 5: Transpile the bundled JS files with Babel
console.log("Transpiling bundled JavaScript files with babel...");
execSync(`npx babel "${BROWSER_ES5_DIR}" --out-dir "${BROWSER_ES5_DIR}" --extensions ".js" --verbose`);

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
