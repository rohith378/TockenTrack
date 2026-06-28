const router = require('express').Router();
const Request = require('../models/Request');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { callProvider } = require('../utils/providers');
const { gradePrompt, generateSuggestions } = require('../utils/efficiency');
const { sendBudgetAlert } = require('../utils/mailer');

/* ── GET /api/requests ── */
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const model = req.query.model;
    const query = { user: req.user._id };
    if (model && model !== 'all') query.model = model;
    const total = await Request.countDocuments(query);
    const requests = await Request.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ requests, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── POST /api/requests — real multi-provider call ── */
router.post('/', auth, async (req, res) => {
  try {
    const { prompt, model } = req.body;
    if (!prompt || !model) return res.status(400).json({ message: 'prompt and model are required' });

    const t0 = Date.now();
    const result = await callProvider(model, req.user.apiKeys, prompt);
    const responseTime = Date.now() - t0;

    const { inputTokens, outputTokens, text, provider, pricing } = result;
    const totalTokens = inputTokens + outputTokens;
    const cost = (inputTokens / 1000) * pricing.in + (outputTokens / 1000) * pricing.out;
    const efficiencyGrade = gradePrompt(inputTokens);
    const suggestions = generateSuggestions(prompt, inputTokens, outputTokens);

    const request = await Request.create({
      user: req.user._id, prompt, model, provider,
      inputTokens, outputTokens, totalTokens,
      cost: parseFloat(cost.toFixed(6)),
      efficiencyGrade, suggestions, responseTime,
    });

    /* ── Budget alert check (fire-and-forget) ── */
    checkBudgetAndAlert(req.user._id).catch(e => console.error('Budget check failed:', e.message));

    res.status(201).json({ ...request.toObject(), aiResponse: text });
  } catch (err) {
    console.error('Provider error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const r = await Request.findOne({ _id: req.params.id, user: req.user._id });
    if (!r) return res.status(404).json({ message: 'Not found' });
    await r.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Budget alert logic ── */
async function checkBudgetAndAlert(userId) {
  const user = await User.findById(userId);
  if (!user || !user.monthlyBudget || user.monthlyBudget <= 0) return;

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // reset alert flags on new month
  if (user.budgetAlertsSent.month !== monthKey) {
    user.budgetAlertsSent = { at80: false, at90: false, at100: false, month: monthKey };
  }

  const agg = await Request.aggregate([
    { $match: { user: user._id, createdAt: { $gte: monthStart } } },
    { $group: { _id: null, totalCost: { $sum: '$cost' } } }
  ]);
  const spent = agg[0]?.totalCost || 0;
  const pct = (spent / user.monthlyBudget) * 100;

  let fired = null;
  if (pct >= 100 && !user.budgetAlertsSent.at100) { fired = 100; user.budgetAlertsSent.at100 = true; }
  else if (pct >= 90 && !user.budgetAlertsSent.at90) { fired = 90; user.budgetAlertsSent.at90 = true; }
  else if (pct >= 80 && !user.budgetAlertsSent.at80) { fired = 80; user.budgetAlertsSent.at80 = true; }

  if (fired) {
    await sendBudgetAlert(user.email, user.name, fired, spent, user.monthlyBudget);
  }
  await user.save();
}

module.exports = router;
