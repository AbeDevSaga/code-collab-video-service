const express = require("express");
const {
  createService,
  updateService,
  deleteService,
  getAllServices,
  getServiceById,
} = require("../controllers/serviceController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🛠️ Admin Routes
router.post("/create", isAuthenticated, isAdmin, createService);
router.put("/update/:id", isAuthenticated, isAdmin, updateService);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteService);

// 🔍 User Routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);

module.exports = router;
