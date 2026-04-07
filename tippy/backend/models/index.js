const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── User / Streamer model ──────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  displayName:  { type: String, default: '' },
  bio:          { type: String, default: '', maxlength: 300 },
  avatar:       { type: String, default: '' },
  plan:         { type: String, enum: ['free', 'pro', 'agency'], default: 'free' },
  bankAccount:  { accountNo: String, bank: String, holderName: String },
  alertSettings: {
    soundUrl:    { type: String, default: '' },
    duration:    { type: Number, default: 5000 },
    minAmount:   { type: Number, default: 0 },
    template:    { type: String, default: 'default' },
    textColor:   { type: String, default: '#ffffff' },
    fontSize:    { type: Number, default: 24 },
  },
  totalReceived: { type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function(plain) {
  return bcrypt.hash(plain, 12);
};

// ── Donation model ─────────────────────────────────────────────────────────
const donationSchema = new mongoose.Schema({
  streamer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName:   { type: String, required: true, maxlength: 50 },
  message:      { type: String, default: '', maxlength: 300 },
  amount:       { type: Number, required: true, min: 1000 },
  currency:     { type: String, default: 'MNT' },
  paymentMethod:{ type: String, enum: ['qpay', 'socialpay', 'card'], required: true },
  transactionId:{ type: String, unique: true },
  status:       { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  alertShown:   { type: Boolean, default: false },
  ipAddress:    { type: String },
}, { timestamps: true });

// ── Goal model ─────────────────────────────────────────────────────────────
const goalSchema = new mongoose.Schema({
  streamer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, maxlength: 100 },
  targetAmount:{ type: Number, required: true },
  currentAmount:{ type: Number, default: 0 },
  active:      { type: Boolean, default: true },
  endsAt:      { type: Date },
}, { timestamps: true });

module.exports = {
  User:     mongoose.model('User', userSchema),
  Donation: mongoose.model('Donation', donationSchema),
  Goal:     mongoose.model('Goal', goalSchema),
};
