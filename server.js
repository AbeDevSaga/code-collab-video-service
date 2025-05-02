const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./configuration/db_config");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use("/api/files", require("./routes/fileRoutes"));
app.use("/api/git", require("./routes/gitRoutes"));

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Code Collaboration Platform!</h1><p>Use the /api/files and /api/git routes to manage files and Git operations.</p>"
  );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
