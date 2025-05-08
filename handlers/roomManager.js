const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.activeRooms = new Map(); // In-memory store for better performance
  }

  async createRoom(roomId, createdBy) {
    const room = new Room({
      roomId,
      createdBy,
      peers: [],
      createdAt: new Date()
    });

    this.activeRooms.set(roomId, {
      peers: new Map(),
      createdAt: Date.now()
    });

    await room.save();
    return room;
  }

  async getRoom(roomId) {
    // Check in-memory first
    if (this.activeRooms.has(roomId)) {
      return this.activeRooms.get(roomId);
    }

    // Fallback to database
    const room = await Room.findOne({ roomId });
    if (room) {
      this.activeRooms.set(roomId, {
        peers: new Map(room.peers.map(p => [p.peerId, p])),
        createdAt: room.createdAt
      });
    }
    return room;
  }

  async addPeer(roomId, peerId, userId, socketId) {
    if (!this.activeRooms.has(roomId)) {
      throw new Error('Room does not exist');
    }

    const peerData = {
      peerId,
      userId,
      socketId,
      joinedAt: new Date(),
      streams: []
    };

    this.activeRooms.get(roomId).peers.set(peerId, peerData);

    // Update database
    await Room.findOneAndUpdate(
      { roomId },
      { $addToSet: { peers: peerData } },
      { upsert: true }
    );
  }

  async removePeer(roomId, peerId) {
    if (!this.activeRooms.has(roomId)) return;

    const room = this.activeRooms.get(roomId);
    room.peers.delete(peerId);

    // Cleanup empty rooms
    if (room.peers.size === 0) {
      this.activeRooms.delete(roomId);
    }

    // Update database
    await Room.findOneAndUpdate(
      { roomId },
      { $pull: { peers: { peerId } } }
    );
  }

  async getPeers(roomId) {
    if (!this.activeRooms.has(roomId)) return [];
    const room = this.activeRooms.get(roomId);
    return Array.from(room.peers.values());
  }

  async peerExists(roomId, peerId) {
    if (!this.activeRooms.has(roomId)) return false;
    return this.activeRooms.get(roomId).peers.has(peerId);
  }
}

module.exports = RoomManager;