const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  model: { type: String, required: true },
  provider: { type: String, required: true, enum: ['groq', 'openai', 'anthropic', 'gemini'] },
  inputTokens: { type: Number, required: true },
  outputTokens: { type: Number, required: true },
  totalTokens: { type: Number, required: true },
  cost: { type: Number, required: true },
  efficiencyGrade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C', 'D'], default: 'B' },
  suggestions: [{ type: String }],
  responseTime: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

requestSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Request', requestSchema);
