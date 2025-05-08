const express = require("express");
const router = express.Router();
const { createRoom, getRoomInfo } = require("../controllers/videoController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/rooms", isAuthenticated, createRoom);
router.get("/rooms/:roomId", isAuthenticated, getRoomInfo);

module.exports = router;
