const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/credentials', require('./routes/credentials'));

// connect to mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/job_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
