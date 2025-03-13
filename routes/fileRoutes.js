const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  hasPermission,
} = require("../middlewares/authMiddleware");
const {
  uploadFile,
  downloadFile,
  shareFile,
  updateFile,
  deleteFile,
  addComment,
  getFileDetails,
  restoreFile,
} = require("../controllers/fileController");

const router = express.Router();

// 🛠️ Admin Routes
router.post("/upload", isAuthenticated, uploadFile);
router.put("/update/:id", isAuthenticated, updateFile);
router.delete("/delete/:id", isAuthenticated, deleteFile);
router.post("/restore/:id", isAuthenticated, restoreFile);

// 🔍 User Routes
router.get("/download/:id", isAuthenticated, downloadFile);
router.post("/share/:id", isAuthenticated, shareFile);
router.post("/comment/:id", isAuthenticated, addComment);
router.get("/:id", isAuthenticated, getFileDetails);

module.exports = router;
