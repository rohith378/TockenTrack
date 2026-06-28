const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  monthlyBudget: { type: Number, default: 0 }, // 0 = no budget set
  apiKeys: {
    groq:      { type: String, default: '' },
    openai:    { type: String, default: '' },
    anthropic: { type: String, default: '' },
    gemini:    { type: String, default: '' },
  },
  budgetAlertsSent: {
    at80: { type: Boolean, default: false },
    at90: { type: Boolean, default: false },
    at100: { type: Boolean, default: false },
    month: { type: String, default: '' }, // "2026-06" — resets alerts each month
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 12);
  ;
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
