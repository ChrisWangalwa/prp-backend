// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.get('/verify-role', authenticate, (req, res) => {
  res.json({ role: req.user.role || 'user' });
});

module.exports = router;
