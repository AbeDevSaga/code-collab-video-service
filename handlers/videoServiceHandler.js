const ChatGroup = require("../models/ChatGroup");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// Track active connections and media states
const activeConnections = new Map();
const mediaStates = new Map();

const validateChatGroupAccess = async (userId, chatGroupId) => {
  const chatGroup = await ChatGroup.findOne({
    _id: chatGroupId,
    "participants.user": userId,
    "participants.status": "active",
  });
  return !!chatGroup;
};

const authenticateSocket = (socket, next) => {
  const token =
    socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

const joinVideoRoom = async (socket, { chatGroupId }, io) => {
    console.log("join video room", joinVideoRoom)
  try {
    if (!socket.user) throw new Error("Not authenticated");

    const hasAccess = await validateChatGroupAccess(
      socket.user._id,
      chatGroupId
    );
    if (!hasAccess) throw new Error("Access denied to video room");

    const roomId = `video:${chatGroupId}`;
    await socket.join(roomId);

    // Get participants from database
    const chatGroup = await ChatGroup.findById(chatGroupId).populate(
      "participants.user",
      "name avatar email"
    );

    const participants = chatGroup.participants
      .filter((p) => p.status === "active")
      .map((p) => ({
        userId: p.user._id.toString(),
        name: p.user.name,
        avatar: p.user.avatar,
        email: p.user.email,
        role: p.role,
        mediaState: mediaStates.get(p.user._id.toString()) || {
          video: true,
          audio: true,
        },
      }));

    // Notify others
    socket.to(roomId).emit("USER_JOINED", {
      userId: socket.user._id,
      name: socket.user.name,
      avatar: socket.user.avatar,
      mediaState: mediaStates.get(socket.user._id.toString()) || {
        video: true,
        audio: true,
      },
    });

    // Send room info to joining user
    socket.emit("ROOM_JOINED", {
      roomId: chatGroupId,
      participants,
      yourId: socket.user._id,
    });
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to join video room",
      details: err.message,
    });
    console.error("Join room error:", err);
  }
};

const handleOffer = async (socket, { to, offer, chatGroupId }, io) => {
  try {
    // Verify both users are in the same chat group
    const isValid =
      (await validateChatGroupAccess(socket.user._id, chatGroupId)) &&
      (await validateChatGroupAccess(to, chatGroupId));

    if (!isValid) {
      throw new Error("Invalid peer connection attempt");
    }

    io.to(`user:${to}`).emit("OFFER", {
      from: socket.user._id,
      offer,
      chatGroupId,
    });
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to send offer",
      details: err.message,
    });
  }
};

const handleAnswer = async (socket, { to, answer, chatGroupId }, io) => {
  try {
    io.to(`user:${to}`).emit("ANSWER", {
      from: socket.user._id,
      answer,
      chatGroupId,
    });
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to send answer",
      details: err.message,
    });
  }
};

const handleIceCandidate = async (
  socket,
  { to, candidate, chatGroupId },
  io
) => {
  try {
    io.to(`user:${to}`).emit("ICE_CANDIDATE", {
      from: socket.user._id,
      candidate,
      chatGroupId,
    });
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to send ICE candidate",
      details: err.message,
    });
  }
};

const leaveVideoRoom = async (socket, { chatGroupId }, io) => {
  try {
    const roomId = `video:${chatGroupId}`;

    // Notify others in the room
    socket.to(roomId).emit("USER_LEFT", {
      userId: socket.user._id,
    });

    // Clean up any peer connections
    activeConnections.forEach((conn, key) => {
      if (key.includes(socket.user._id)) {
        conn.close();
        activeConnections.delete(key);
      }
    });

    // Leave the room
    socket.leave(roomId);
    socket.emit("ROOM_LEFT", { chatGroupId });

    console.log(
      `User ${socket.user._id} left video room for chat group ${chatGroupId}`
    );
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to leave video room",
      details: err.message,
    });
    console.error(err);
  }
};

const toggleVideoMute = async (socket, { chatGroupId, isMuted }) => {
  try {
    // Update media state
    const userId = socket.user._id;
    const currentState = mediaStates.get(userId) || {
      video: true,
      audio: true,
    };
    mediaStates.set(userId, { ...currentState, video: !isMuted });

    // Broadcast to room
    socket.to(`video:${chatGroupId}`).emit("VIDEO_MUTE_TOGGLED", {
      userId,
      isMuted,
    });
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to toggle video",
      details: err.message,
    });
  }
};

const toggleAudioMute = async (socket, { chatGroupId, isMuted }) => {
  try {
    // Update media state
    const userId = socket.user._id;
    const currentState = mediaStates.get(userId) || {
      video: true,
      audio: true,
    };
    mediaStates.set(userId, { ...currentState, audio: !isMuted });

    // Broadcast to room
    socket.to(`video:${chatGroupId}`).emit("AUDIO_MUTE_TOGGLED", {
      userId,
      isMuted,
    });
  } catch (err) {
    socket.emit("VIDEO_ERROR", {
      message: "Failed to toggle audio",
      details: err.message,
    });
  }
};

const registerVideoHandlers = (io, socket) => {
  // Authentication middleware for socket
  socket.use((packet, next) => {
    if (packet[0] === "authenticate") {
      const token = packet[1]?.token || "";
      try {
        const decoded = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.JWT_SECRET
        );
        socket.user = decoded;
        next();
      } catch (err) {
        next(new Error("Authentication failed"));
      }
    } else {
      // For other events, check if authenticated
      if (!socket.user) {
        return next(new Error("Not authenticated"));
      }
      next();
    }
  });

  // Room management
  socket.on("JOIN_VIDEO_ROOM", (data, callback) => {
    joinVideoRoom(socket, data, io)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  socket.on("LEAVE_VIDEO_ROOM", (data, callback) => {
    leaveVideoRoom(socket, data, io)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  // WebRTC signaling
  socket.on("OFFER", (data, callback) => {
    handleOffer(socket, data, io)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  socket.on("ANSWER", (data, callback) => {
    handleAnswer(socket, data, io)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  socket.on("ICE_CANDIDATE", (data, callback) => {
    handleIceCandidate(socket, data, io)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  // Media controls
  socket.on("TOGGLE_VIDEO_MUTE", (data, callback) => {
    toggleVideoMute(socket, data)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  socket.on("TOGGLE_AUDIO_MUTE", (data, callback) => {
    toggleAudioMute(socket, data)
      .then(() => callback({ success: true }))
      .catch((err) => callback({ error: err.message }));
  });

  // Clean up on disconnect
  socket.on("disconnect", async () => {
    if (!socket.user) return;

    try {
      const rooms = Array.from(socket.rooms).filter((r) =>
        r.startsWith("video:")
      );

      await Promise.all(
        rooms.map((room) => {
          const chatGroupId = room.replace("video:", "");
          return leaveVideoRoom(socket, { chatGroupId }, io);
        })
      );

      mediaStates.delete(socket.user._id);
    } catch (err) {
      console.error("Disconnect cleanup error:", err);
    }
  });
};

module.exports = {
  authenticateSocket,
  registerVideoHandlers,
};
