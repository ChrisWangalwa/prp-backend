const express = require('express');
const multer = require('multer');
const Submission = require('../models/Submission');
const admin = require('../firebase');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'backend/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 🔐 Firebase token check middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// ✅ Main submit route
router.post('/', authenticate, upload.single('evidence'), async (req, res) => {
  const { title, organization, content, tags, region } = req.body;
  const evidence = req.file?.filename;

  const newSubmission = new Submission({
    title,
    organization,
    content,
    tags: tags?.split(',').map(t => t.trim()),
    region,
    evidence,
    submittedBy: req.user.email,
    version: 1
  });

  await newSubmission.save();
  res.json({ success: true });
});

// 👇 This is the line you MUST have at the bottom
module.exports = router;
