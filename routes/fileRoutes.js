const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  hasPermission,
} = require("../middlewares/authMiddleware");
const {
  createFile,
  getFileContent,
  saveFile,
  updateFile,
  deleteFile,
  listFiles,
  getFileStructure,
  getEnhancedFileStructure
} = require("../controllers/fileController");

const router = express.Router();
listFiles
// File Routes
router.post("/create", isAuthenticated, createFile);
router.put("/update/:id", isAuthenticated, updateFile);
router.delete("/delete/:id", isAuthenticated, deleteFile);
router.get("/content/:id", isAuthenticated, getFileContent);
router.get("/list", isAuthenticated, getEnhancedFileStructure);
router.get("/structure", isAuthenticated, getFileStructure);
router.put("/save/:id", isAuthenticated, saveFile);

// User Routes
// router.get("/download/:id", isAuthenticated, downloadFile);
// router.post("/share/:id", isAuthenticated, shareFile);
// router.post("/comment/:id", isAuthenticated, addComment);
// router.get("/:id", isAuthenticated, getFileDetails);

module.exports = router;