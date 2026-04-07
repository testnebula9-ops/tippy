const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'tippy-secret-change-in-prod';

// Verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token шаардлагатай' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'Хэрэглэгч олдсонгүй' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Буруу эсвэл хугацаа дууссан token' });
  }
};

// Generate JWT
const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

module.exports = { authMiddleware, signToken };
