const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

/* ── GET current settings ── */
router.get('/', auth, async (req, res) => {
  const u = req.user;
  res.json({
    theme: u.theme,
    monthlyBudget: u.monthlyBudget,
    apiKeys: {
      groq: maskKey(u.apiKeys.groq),
      openai: maskKey(u.apiKeys.openai),
      anthropic: maskKey(u.apiKeys.anthropic),
      gemini: maskKey(u.apiKeys.gemini),
    },
    apiKeysSet: {
      groq: !!u.apiKeys.groq,
      openai: !!u.apiKeys.openai,
      anthropic: !!u.apiKeys.anthropic,
      gemini: !!u.apiKeys.gemini,
    }
  });
});

function maskKey(key) {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 4) + '••••••••' + key.slice(-4);
}

/* ── PATCH theme ── */
router.patch('/theme', auth, async (req, res) => {
  const { theme } = req.body;
  if (!['dark', 'light'].includes(theme)) return res.status(400).json({ message: 'Invalid theme' });
  req.user.theme = theme;
  await req.user.save();
  res.json({ theme });
});

/* ── PATCH budget ── */
router.patch('/budget', auth, async (req, res) => {
  const { monthlyBudget } = req.body;
  if (typeof monthlyBudget !== 'number' || monthlyBudget < 0) return res.status(400).json({ message: 'Invalid budget' });
  req.user.monthlyBudget = monthlyBudget;
  await req.user.save();
  res.json({ monthlyBudget });
});

/* ── PATCH api keys ── */
router.patch('/api-keys', auth, async (req, res) => {
  const { provider, key } = req.body;
  const valid = ['groq', 'openai', 'anthropic', 'gemini'];
  if (!valid.includes(provider)) return res.status(400).json({ message: 'Invalid provider' });
  req.user.apiKeys[provider] = key || '';
  await req.user.save();
  res.json({ message: 'API key updated', provider });
});

module.exports = router;
