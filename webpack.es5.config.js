const path = require("path");
const fs = require("fs");

// Define paths
const DIST_DIR = "dist/donate-frontend";
const BROWSER_DIR = path.join(DIST_DIR, "browser");
const BROWSER_ES5_DIR = path.join(DIST_DIR, "browser-es5");

// Function to recursively find all JS files in a directory
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith(".js")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Find all JS files in the browser directory
const entryFiles = findJsFiles(BROWSER_DIR);

// Create entry object for webpack
const entries = {};
entryFiles.forEach((file) => {
  // Get the relative path from the browser directory
  const relativePath = path.relative(BROWSER_DIR, file);
  // Use the relative path (without .js extension) as the entry name
  const entryName = relativePath.replace(/\.js$/, "");
  // Add './' prefix to file paths to ensure proper resolution
  entries[entryName] = "./" + file;
});

module.exports = {
  mode: "production",
  entry: entries,
  experiments: {
    outputModule: false, // Ensure we don't output ES modules
  },
  output: {
    path: path.resolve(__dirname, BROWSER_ES5_DIR),
    filename: "[name].js",
    // Ensure paths match the original structure
    publicPath: "/d-es5/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: "71",
                  },
                  useBuiltIns: false, // Disable automatic polyfill injection to avoid require() statements
                  modules: false, // Keep modules as ES6, let webpack handle bundling
                  forceAllTransforms: true, // Force all transforms for maximum compatibility
                },
              ],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    // Minimize the output for production
    minimize: true,
    // Don't split chunks to keep it simple for legacy browsers
    splitChunks: false,
    // Disable scope hoisting for better ES5 compatibility
    concatenateModules: false,
  },
  // Ensure proper source maps for debugging
  devtool: "source-map",
  // Target browsers that support ES5
  target: ["web", "es5"],
};
