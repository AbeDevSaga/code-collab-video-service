const RoomManager = require('./roomManager');
const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  const roomManager = new RoomManager();

  io.on('connection', (socket) => {
    console.log(`New signaling connection: ${socket.id}`);

    // Room Management
    socket.on('create-room', async (userId, callback) => {
      try {
        const roomId = uuidv4();
        await roomManager.createRoom(roomId, userId);
        callback({ success: true, roomId });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('join-room', async (roomId, peerId, userId, callback) => {
      try {
        const room = await roomManager.getRoom(roomId);
        if (!room) throw new Error('Room not found');

        socket.join(roomId);
        await roomManager.addPeer(roomId, peerId, userId, socket.id);

        // Notify room about new user
        socket.to(roomId).emit('user-connected', { peerId, userId });

        // Send existing peers to the new user
        const peers = await roomManager.getPeers(roomId);
        callback({ 
          success: true, 
          peers: peers.filter(p => p.peerId !== peerId) 
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
          await roomManager.removePeer(roomId, peerId);
          socket.to(roomId).emit('user-disconnected', { peerId, userId });
        });

      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // WebRTC Signaling
    socket.on('offer', (roomId, peerId, offer) => {
      socket.to(roomId).emit('offer', peerId, offer);
    });

    socket.on('answer', (roomId, peerId, answer) => {
      socket.to(roomId).emit('answer', peerId, answer);
    });

    socket.on('ice-candidate', (roomId, peerId, candidate) => {
      socket.to(roomId).emit('ice-candidate', peerId, candidate);
    });

    // Screen Sharing
    socket.on('start-screen-share', (roomId, peerId) => {
      socket.to(roomId).emit('screen-share-started', peerId);
    });

    socket.on('stop-screen-share', (roomId, peerId) => {
      socket.to(roomId).emit('screen-share-stopped', peerId);
    });

    // Mute/Unmute
    socket.on('toggle-audio', (roomId, peerId, isMuted) => {
      socket.to(roomId).emit('audio-toggled', peerId, isMuted);
    });

    socket.on('toggle-video', (roomId, peerId, isVideoOff) => {
      socket.to(roomId).emit('video-toggled', peerId, isVideoOff);
    });
  });
};