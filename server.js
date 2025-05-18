const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./configuration/db_config");
const { registerVideoHandlers } = require("./handlers/videoServiceHandler");

dotenv.config();

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

connectDB();

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`
  );
  next();
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions,
});

// Share session between Express and Socket.IO
// io.use(sharedsession(sessionMiddleware, {
//   autoSave: true
// }));

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  registerVideoHandlers(io, socket);
  // Socket event handlers
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });
});

// Routes
app.use("/api/video", require("./routes/videoRoutes"));


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

// Start Server
const PORT = process.env.PORT || 5006;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`HTTP  → http://localhost:${PORT}/api`);
  console.log(`WS    → ws://localhost:${PORT}`);
});
