// Helper function to determine if a file is text-based
const path = require("path");
function isTextFile(filename) {
  const textExtensions = [
    ".txt",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".html",
    ".css",
    ".scss",
    ".json",
    ".md",
    ".yml",
    ".yaml",
    ".xml",
    ".csv",
    ".php",
    ".py",
    ".rb",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".sh",
    ".go",
    ".rs",
  ];
  const ext = path.extname(filename).toLowerCase();
  return textExtensions.includes(ext);
}

module.exports = { isTextFile };