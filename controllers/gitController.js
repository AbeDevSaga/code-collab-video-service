const fs = require("fs");
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const File = require("../models/file");

// Helper function to get the Git repository path for a file
const getRepoPath = (fileId) => {
  return path.join(__dirname, `../repos/${fileId}`);
};

// 1. Commit changes to a file
const commitChanges = async (req, res) => {
  try {
    const { fileId, message } = req.body;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to commit changes
    if (!hasPermission(file, userId, "editor")) {
      return res.status(403).json({ message: "You do not have permission to commit changes" });
    }

    const repoPath = getRepoPath(fileId);

    // Add the file to the Git index
    await git.add({ fs, dir: repoPath, filepath: file.name });

    // Commit the changes
    const commitHash = await git.commit({
      fs,
      dir: repoPath,
      author: { name: req.user.username, email: req.user.email },
      message,
    });

    res.status(200).json({ message: "Changes committed successfully", commitHash });
  } catch (error) {
    res.status(500).json({ message: "Error committing changes", error: error.message });
  }
};

// 2. Create a new branch
const createBranch = async (req, res) => {
  try {
    const { fileId, branchName } = req.body;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to create a branch
    if (!hasPermission(file, userId, "editor")) {
      return res.status(403).json({ message: "You do not have permission to create a branch" });
    }

    const repoPath = getRepoPath(fileId);

    // Create a new branch
    await git.branch({ fs, dir: repoPath, ref: branchName });

    res.status(200).json({ message: "Branch created successfully", branchName });
  } catch (error) {
    res.status(500).json({ message: "Error creating branch", error: error.message });
  }
};

// 3. Merge branches
const mergeBranch = async (req, res) => {
  try {
    const { fileId, sourceBranch, targetBranch } = req.body;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to merge branches
    if (!hasPermission(file, userId, "editor")) {
      return res.status(403).json({ message: "You do not have permission to merge branches" });
    }

    const repoPath = getRepoPath(fileId);

    // Merge the source branch into the target branch
    await git.merge({
      fs,
      dir: repoPath,
      ours: targetBranch,
      theirs: sourceBranch,
    });

    res.status(200).json({ message: "Branches merged successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error merging branches", error: error.message });
  }
};

// 4. Get commit history for a file
const getCommitHistory = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to view commit history
    if (!hasPermission(file, userId, "viewer")) {
      return res.status(403).json({ message: "You do not have permission to view commit history" });
    }

    const repoPath = getRepoPath(fileId);

    // Get the commit history
    const commits = await git.log({ fs, dir: repoPath });

    res.status(200).json({ commits });
  } catch (error) {
    res.status(500).json({ message: "Error fetching commit history", error: error.message });
  }
};

module.exports = {
  commitChanges,
  createBranch,
  mergeBranch,
  getCommitHistory,
};