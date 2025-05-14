const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const passwordResetRoutes = require('./routes/passwordReset');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded values
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://bansalabhi1008:ramji@cluster0.kreyymy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
process.env.JWT_SECRET = 'mysecretkey123';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Address Search Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});