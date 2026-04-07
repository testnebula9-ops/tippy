const router = require('express').Router();
const { User, Donation, Goal } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// GET /api/streamers/:username  — public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('username displayName bio avatar plan alertSettings totalReceived createdAt');
    if (!user) return res.status(404).json({ error: 'Стример олдсонгүй' });

    const goal = await Goal.findOne({ streamer: user._id, active: true });
    const recentDonations = await Donation.find({ streamer: user._id, status: 'paid' })
      .sort({ createdAt: -1 }).limit(5)
      .select('senderName message amount createdAt');

    res.json({ streamer: user, goal, recentDonations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/streamers  — list top streamers (public leaderboard)
router.get('/', async (req, res) => {
  try {
    const streamers = await User.find()
      .sort({ totalReceived: -1 })
      .limit(20)
      .select('username displayName avatar totalReceived plan');
    res.json({ streamers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streamers/goal  — create/update goal
router.post('/goal', authMiddleware, async (req, res) => {
  try {
    const { title, targetAmount, endsAt } = req.body;
    // Deactivate old goals
    await Goal.updateMany({ streamer: req.user._id }, { active: false });
    const goal = await Goal.create({ streamer: req.user._id, title, targetAmount, endsAt });
    res.status(201).json({ goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
