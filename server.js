const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./configuration/db_config");
const setupPeerServer = require('./handler/peerServer'); // Correct path to your peerServer module
const setupSignaling = require('./components/signaling');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize PeerServer using your module
const peerServer = setupPeerServer(server);

// Socket.io Setup
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

connectDB();

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`
  );
  next();
});

// Routes
app.use("/api/video", require("./routes/videoRoutes"));
app.use("/peerjs", peerServer); // Mount the PeerServer at /peerjs

// Socket.io connection handling
setupSignaling(io);

app.get("/", (req, res) => {
  res.send(`
    <h1>Video Collaboration Service</h1>
    <p>Endpoints:</p>
    <ul>
      <li><b>/api/video</b> - Room management API</li>
      <li><b>/peerjs</b> - WebRTC peer connections</li>
      <li><b>/ws</b> - Socket.io signaling (automatic)</li>
    </ul>
  `);
});

server.listen(PORT, () => {
  console.log(`Video server running on port ${PORT}`);
  console.log(`PeerJS server running on /peerjs`);
});