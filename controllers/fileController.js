const File = require("../models/file");
const Organization = require("../models/organization");
const Project = require("../models/project");
const User = require("../models/user");

// 1. Upload a file
const uploadFile = async (req, res) => {
  try {
    const { name, type, projectId, organizationId } = req.body;
    const createdBy = req.user._id; // User ID from the authenticated request

    // Validate project and organization
    const project = await Project.findById(projectId);
    const organization = await Organization.findById(organizationId);

    if (!project || !organization) {
      return res.status(404).json({ message: "Project or Organization not found" });
    }

    // Create the file
    const file = new File({
      name,
      type,
      path: req.file.path, // Assuming Multer handles file uploads and stores the path
      size: req.file.size,
      extension: req.file.originalname.split(".").pop(),
      createdBy,
      project: projectId,
      organization: organizationId,
      sharedWith: [{ user: createdBy, role: "admin" }], // Creator has admin access
    });

    await file.save();

    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};

// 2. Download a file
const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to download the file
    if (!hasPermission(file, userId, "viewer")) {
      return res.status(403).json({ message: "You do not have permission to download this file" });
    }

    // Send the file for download
    res.download(file.path);
  } catch (error) {
    res.status(500).json({ message: "Error downloading file", error: error.message });
  }
};

// 3. Share a file with another user
const shareFile = async (req, res) => {
  try {
    const { fileId, userId, role } = req.body;
    const sharedBy = req.user._id;

    const file = await File.findById(fileId);
    const userToShareWith = await User.findById(userId);

    if (!file || !userToShareWith) {
      return res.status(404).json({ message: "File or User not found" });
    }

    // Check if the user has permission to share the file
    if (!hasPermission(file, sharedBy, "admin")) {
      return res.status(403).json({ message: "You do not have permission to share this file" });
    }

    // Add the user to the sharedWith array
    file.sharedWith.push({ user: userId, role, addedAt: Date.now(), addedBy: sharedBy });
    await file.save();

    res.status(200).json({ message: "File shared successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error sharing file", error: error.message });
  }
};

// 4. Update a file
const updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;
    const { name, type } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to update the file
    if (!hasPermission(file, userId, "editor")) {
      return res.status(403).json({ message: "You do not have permission to update this file" });
    }

    // Update file details
    file.name = name || file.name;
    file.type = type || file.type;
    file.updated_at = Date.now();

    await file.save();

    res.status(200).json({ message: "File updated successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error updating file", error: error.message });
  }
};

// 5. Delete a file (soft delete)
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to delete the file
    if (!hasPermission(file, userId, "admin")) {
      return res.status(403).json({ message: "You do not have permission to delete this file" });
    }

    // Soft delete the file
    file.isDeleted = true;
    file.deletedAt = Date.now();
    await file.save();

    res.status(200).json({ message: "File deleted successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};

// 6. Add a comment to a file
const addComment = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;
    const { comment } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Add the comment
    file.comments.push({ user: userId, comment, createdAt: Date.now() });
    await file.save();

    res.status(201).json({ message: "Comment added successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// 7. Get file details (including comments, history, etc.)
const getFileDetails = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;

    const file = await File.findById(fileId).populate(
      "sharedWith.user createdBy collaborators.user comments.user comments.replies.user"
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to view the file
    if (!hasPermission(file, userId, "viewer")) {
      return res.status(403).json({ message: "You do not have permission to view this file" });
    }

    res.status(200).json({ file });
  } catch (error) {
    res.status(500).json({ message: "Error fetching file details", error: error.message });
  }
};

// 8. Restore a soft-deleted file
const restoreFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the user has permission to restore the file
    if (!hasPermission(file, userId, "admin")) {
      return res.status(403).json({ message: "You do not have permission to restore this file" });
    }

    // Restore the file
    file.isDeleted = false;
    file.deletedAt = null;
    await file.save();

    res.status(200).json({ message: "File restored successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error restoring file", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  uploadFile,
  downloadFile,
  shareFile,
  updateFile,
  deleteFile,
  addComment,
  getFileDetails,
  restoreFile,
};