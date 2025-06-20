// backend/routes/admin.js
const express = require('express');
const Submission = require('../models/Submission');
const admin = require('../firebase');

const router = express.Router();

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded.admin) return res.status(403).json({ message: 'Not an admin' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

router.get('/pending', authenticate, async (req, res) => {
  const items = await Submission.find({ status: 'pending' });
  res.json(items);
});

router.post('/decision/:id', authenticate, async (req, res) => {
  const { status } = req.body;
  await Submission.findByIdAndUpdate(req.params.id, { status });
  res.json({ message: `Submission ${status}` });
});

module.exports = router;
