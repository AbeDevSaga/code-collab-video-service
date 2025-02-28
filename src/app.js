const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configuration/db_config')
const seedServices = require('./models/seedServices');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
connectDB();
seedServices();

// Routes
app.use('/api/services', require('./routes/serviceRoutes'));

// Homepage route (accessible in the browser)
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Service List!</h1><p>Use the /api/service/register and /api/service/login routes to register and login services.</p>');
});

app.listen(PORT, () => console.log(`service running on port ${PORT}`));
