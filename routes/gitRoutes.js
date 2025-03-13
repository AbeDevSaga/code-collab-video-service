const express = require("express");
const {
  commitChanges,
  createBranch,
  mergeBranch,
  getCommitHistory,
} = require("../controllers/gitController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

// Git operations
router.post("/commit", isAuthenticated, commitChanges); // Commit changes to a file
router.post("/branch", isAuthenticated, createBranch); // Create a new branch
router.post("/merge", isAuthenticated, mergeBranch); // Merge branches
router.get("/history/:fileId", isAuthenticated, getCommitHistory); // Get commit history for a file

module.exports = router;