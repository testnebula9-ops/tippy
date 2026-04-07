const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { Donation, User, Goal } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// POST /api/donations  — viewer sends a donation
router.post('/', async (req, res) => {
  try {
    const { streamerUsername, senderName, message, amount, paymentMethod } = req.body;

    if (!streamerUsername || !senderName || !amount || !paymentMethod)
      return res.status(400).json({ error: 'Шаардлагатай талбарууд дутуу байна' });
    if (amount < 1000)
      return res.status(400).json({ error: 'Хамгийн бага дүн: ₮1,000' });

    const streamer = await User.findOne({ username: streamerUsername });
    if (!streamer) return res.status(404).json({ error: 'Стример олдсонгүй' });

    // Block if amount below streamer's min
    if (amount < streamer.alertSettings.minAmount)
      return res.status(400).json({ error: `Энэ стримерийн хамгийн бага дүн: ₮${streamer.alertSettings.minAmount.toLocaleString()}` });

    const transactionId = uuidv4();
    const donation = await Donation.create({
      streamer: streamer._id,
      senderName: senderName.trim(),
      message: (message || '').trim(),
      amount,
      paymentMethod,
      transactionId,
      status: 'pending',
      ipAddress: req.ip,
    });

    // --- Mock payment gateway integration ---
    // In production: call QPay / SocialPay API here and return payment URL
    const paymentUrls = {
      qpay:       `https://qpay.mn/payment/${transactionId}`,
      socialpay:  `https://socialpay.mn/pay/${transactionId}`,
      card:       `https://payment.tippy.mn/card/${transactionId}`,
    };

    res.status(201).json({
      donationId: donation._id,
      transactionId,
      paymentUrl: paymentUrls[paymentMethod],
      message: 'Donation үүсгэгдлээ. Төлбөр хийснээр баталгаажна.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/donations/confirm  — payment gateway webhook
router.post('/confirm', async (req, res) => {
  try {
    const { transactionId, status, gatewayRef } = req.body;
    // In production: verify webhook signature from QPay/SocialPay

    const donation = await Donation.findOneAndUpdate(
      { transactionId },
      { status: status === 'success' ? 'paid' : 'failed' },
      { new: true }
    ).populate('streamer');

    if (!donation) return res.status(404).json({ error: 'Donation олдсонгүй' });

    if (donation.status === 'paid') {
      // Update streamer totals
      await User.findByIdAndUpdate(donation.streamer._id, {
        $inc: { totalReceived: donation.amount }
      });
      // Update active goal if any
      await Goal.findOneAndUpdate(
        { streamer: donation.streamer._id, active: true },
        { $inc: { currentAmount: donation.amount } }
      );
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/donations/history  — streamer's own donation history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { streamer: req.user._id };
    if (status) filter.status = status;

    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Donation.countDocuments(filter);
    res.json({ donations, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/donations/stats  — streamer dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const streamerId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.toDateString());

    const [total, monthly, daily, count, topDonors] = await Promise.all([
      Donation.aggregate([
        { $match: { streamer: streamerId, status: 'paid' }},
        { $group: { _id: null, sum: { $sum: '$amount' }}}
      ]),
      Donation.aggregate([
        { $match: { streamer: streamerId, status: 'paid', createdAt: { $gte: startOfMonth }}},
        { $group: { _id: null, sum: { $sum: '$amount' }}}
      ]),
      Donation.aggregate([
        { $match: { streamer: streamerId, status: 'paid', createdAt: { $gte: startOfDay }}},
        { $group: { _id: null, sum: { $sum: '$amount' }}}
      ]),
      Donation.countDocuments({ streamer: streamerId, status: 'paid' }),
      Donation.aggregate([
        { $match: { streamer: streamerId, status: 'paid' }},
        { $group: { _id: '$senderName', total: { $sum: '$amount' }, count: { $sum: 1 }}},
        { $sort: { total: -1 }},
        { $limit: 5 }
      ]),
    ]);

    res.json({
      totalReceived: total[0]?.sum || 0,
      monthlyReceived: monthly[0]?.sum || 0,
      dailyReceived: daily[0]?.sum || 0,
      donationCount: count,
      topDonors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
