const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configuration/db_config')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
connectDB();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));

app.listen(PORT, () => console.log(`Authentication service running on port ${PORT}`));
