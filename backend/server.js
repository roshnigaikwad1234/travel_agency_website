// server.js
require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookingsRouter = require('./routes/bookings');
const packagesRouter = require('./routes/packages');
const userRouter = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (local or Atlas)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/travelAgency';
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.log("❌ MongoDB connection error:", err.message || err);
    console.log("Make sure MongoDB is running on localhost:27017");
  });

app.use('/api/bookings', bookingsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/users', userRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
