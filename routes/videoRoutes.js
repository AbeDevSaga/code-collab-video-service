const express = require("express");
const router = express.Router();
const { createRoom, getRoomInfo } = require("../controllers/videoController");
const auth = require("../middlewares/authMiddleware");

router.post("/rooms", auth, createRoom);
router.get("/rooms/:roomId", auth, getRoomInfo);

module.exports = router;