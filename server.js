const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const submitRoute = require('./routes/submit');
const adminRoute = require('./routes/admin'); // ✅ NEW

// ✅ Load .env from parent directory
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 👇 Serve uploaded evidence files
app.use('/uploads', express.static('backend/uploads'));

// 👇 Route for submission
app.use('/submit', submitRoute);

// ✅ Add admin moderation route
app.use('/admin', adminRoute);

// 👇 Connect to MongoDB
console.log('Mongo URI:', process.env.MONGODB_URI); // Debug line

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  
  // 👇 Start server after successful DB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB error:', err);
});
