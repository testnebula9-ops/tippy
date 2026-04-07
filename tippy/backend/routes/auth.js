const router = require('express').Router();
const { User } = require('../models');
const { signToken, authMiddleware } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: 'Бүх талбарыг бөглөнө үү' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой' });
    if (!/^[a-z0-9_]{3,30}$/.test(username))
      return res.status(400).json({ error: 'Username зөвхөн a-z, 0-9, _ тэмдэгт агуулна' });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: 'Username эсвэл email аль хэдийн бүртгэлтэй' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ username, email, passwordHash, displayName: displayName || username });

    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username, email, displayName: user.displayName, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login = username or email
    if (!login || !password) return res.status(400).json({ error: 'Нэвтрэх нэр болон нууц үгийг оруулна уу' });

    const user = await User.findOne({ $or: [{ username: login }, { email: login }] });
    if (!user) return res.status(401).json({ error: 'Нэвтрэх нэр эсвэл нууц үг буруу' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Нэвтрэх нэр эсвэл нууц үг буруу' });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, displayName: user.displayName, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { displayName, bio, alertSettings } = req.body;
    const update = {};
    if (displayName !== undefined) update.displayName = displayName;
    if (bio !== undefined) update.bio = bio;
    if (alertSettings !== undefined) update.alertSettings = { ...req.user.alertSettings.toObject(), ...alertSettings };

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
