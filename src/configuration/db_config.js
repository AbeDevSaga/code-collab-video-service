const mongoose = require("mongoose");
const dotenv = require('dotenv');
//dbUser:#1430Aman@cluster0.l7eba.mongodb.net/code-collab-auth?retryWrites=true&w=majority


dotenv.config();
// const { seedAdminUser } = require("../scripts/seed_admin");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB')
    // await seedAdminUser();
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
