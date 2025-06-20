const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const admin = require('firebase-admin'); // ✅ Firebase Admin
const submitRoute = require('./routes/submit');
const adminRoute = require('./routes/admin');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 🔐 Route to decode token and return role
app.post('/decode-token', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const role = decodedToken.role || 'user';
    res.json({ role });
  } catch (error) {
    console.error('Token decoding error:', error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
});

// Serve evidence files from uploads folder
app.use('/uploads', express.static('backend/uploads'));

// Submission and Admin routes
app.use('/submit', submitRoute);
app.use('/admin', adminRoute);

// Connect to MongoDB
console.log('Mongo URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB error:', err);
});
