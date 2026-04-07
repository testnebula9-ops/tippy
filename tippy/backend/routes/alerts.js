const router = require('express').Router();
const { Donation, User } = require('../models');

// GET /api/alerts/:username  — OBS polls this every 3s
// Returns the next unshown paid donation as an alert
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('alertSettings');
    if (!user) return res.status(404).json({ error: 'Стример олдсонгүй' });

    const donation = await Donation.findOneAndUpdate(
      { streamer: user._id, status: 'paid', alertShown: false },
      { alertShown: true },
      { new: false, sort: { createdAt: 1 } }
    );

    if (!donation) return res.json({ alert: null });

    res.json({
      alert: {
        id: donation._id,
        senderName: donation.senderName,
        message: donation.message,
        amount: donation.amount,
        settings: user.alertSettings,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
