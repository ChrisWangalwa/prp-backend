// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const submitRoute = require('./routes/submit');
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth'); // ✅ NEW route

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

// ✅ Firebase Admin available globally for middleware
global.admin = admin;

// ✅ Routes
app.use('/submit', submitRoute);
app.use('/admin', adminRoute);
app.use('/', authRoute); // for /verify-role

// ✅ Serve uploaded files
app.use('/uploads', express.static('backend/uploads'));

// ✅ MongoDB Connection
console.log('Mongo URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
  });

