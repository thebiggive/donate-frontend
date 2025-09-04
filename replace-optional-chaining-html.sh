#!/bin/bash

# This script finds and replaces optional chaining operators (?.) in HTML template files
# with equivalent code that works in pre-ES2020 environments.

# Function to process a single file
process_file() {
  local file=$1
  echo "Processing $file..."

  # Create a temporary file
  local temp_file=$(mktemp)

  # Read the file line by line
  while IFS= read -r line; do
    # Replace patterns like (obj?.prop) with (obj && obj.prop)
    modified_line=$(echo "$line" | sed -E 's/([a-zA-Z0-9_\.]+)\?\.([a-zA-Z0-9_\.]+)/\1 \&\& \1.\2/g')

    # Write the modified line to the temporary file
    echo "$modified_line" >> "$temp_file"
  done < "$file"

  # Replace the original file with the modified one
  mv "$temp_file" "$file"
}

# Find all HTML template files in the src directory
find_html_files() {
  find /home/barney/projects/donate-frontend/src -name "*.html" -type f
}

# Main script
echo "Starting optional chaining replacement in HTML templates..."

# Process each HTML file
for file in $(find_html_files); do
  # Check if the file contains optional chaining
  if grep -q "?\\." "$file"; then
    process_file "$file"
  fi
done

echo "Replacement in HTML templates complete. Please review the changes manually as some complex cases may need adjustment."
