const Room = require("../models/Room");

const createRoom = async (req, res) => {
  try {
    const { roomId, createdBy } = req.body;
    const room = new Room({ roomId, createdBy });
    await room.save();
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRoomInfo = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createRoom,
  getRoomInfo,
};