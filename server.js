const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //connect frontend to backend

const app = express(); //start express backend instance

// Middleware
app.use(cors()); //allows 3000 to 5000
app.use(express.json()); //json to javascript conversion
app.use(express.urlencoded({ extended: true })); //when fronted gives html instead of json
 
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/terraceclub')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth')); //use routes defined in /routes/auth
app.use('/api/plants', require('./routes/plants'));
app.use('/api/posts', require('./routes/posts'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Terrace Club API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

