const router = require('express').Router();
const Request = require('../models/Request');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, async (req, res) => {
  try {
    const uid = req.user._id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 6);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayStats, weekStats, allTime, monthStats, modelBreakdown, providerBreakdown] = await Promise.all([
      Request.aggregate([{ $match: { user: uid, createdAt: { $gte: todayStart } } }, { $group: { _id: null, totalTokens: { $sum: '$totalTokens' }, totalCost: { $sum: '$cost' }, count: { $sum: 1 } } }]),
      Request.aggregate([{ $match: { user: uid, createdAt: { $gte: weekStart } } }, { $group: { _id: null, totalTokens: { $sum: '$totalTokens' }, totalCost: { $sum: '$cost' }, count: { $sum: 1 } } }]),
      Request.aggregate([{ $match: { user: uid } }, { $group: { _id: null, totalTokens: { $sum: '$totalTokens' }, totalCost: { $sum: '$cost' }, count: { $sum: 1 } } }]),
      Request.aggregate([{ $match: { user: uid, createdAt: { $gte: monthStart } } }, { $group: { _id: null, totalTokens: { $sum: '$totalTokens' }, totalCost: { $sum: '$cost' }, count: { $sum: 1 } } }]),
      Request.aggregate([{ $match: { user: uid, createdAt: { $gte: weekStart } } }, { $group: { _id: '$model', tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' }, count: { $sum: 1 } } }]),
      Request.aggregate([{ $match: { user: uid, createdAt: { $gte: monthStart } } }, { $group: { _id: '$provider', tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' }, count: { $sum: 1 } } }]),
    ]);

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayData = await Request.aggregate([{ $match: { user: uid, createdAt: { $gte: d, $lt: next } } }, { $group: { _id: null, tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' } } }]);
      weeklyTrend.push({ date: d.toISOString().split('T')[0], tokens: dayData[0]?.tokens || 0, cost: dayData[0]?.cost || 0 });
    }

    /* ── Forecast: linear projection based on days elapsed this month ── */
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = now.getDate();
    const monthSpend = monthStats[0]?.totalCost || 0;
    const dailyAvg = daysElapsed > 0 ? monthSpend / daysElapsed : 0;
    const forecastedSpend = dailyAvg * daysInMonth;

    res.json({
      today: todayStats[0] || { totalTokens: 0, totalCost: 0, count: 0 },
      week: weekStats[0] || { totalTokens: 0, totalCost: 0, count: 0 },
      allTime: allTime[0] || { totalTokens: 0, totalCost: 0, count: 0 },
      month: monthStats[0] || { totalTokens: 0, totalCost: 0, count: 0 },
      modelBreakdown,
      providerBreakdown,
      weeklyTrend,
      forecast: {
        daysElapsed, daysInMonth,
        currentSpend: monthSpend,
        dailyAvg: parseFloat(dailyAvg.toFixed(4)),
        forecastedSpend: parseFloat(forecastedSpend.toFixed(2)),
        monthlyBudget: req.user.monthlyBudget,
        budgetPct: req.user.monthlyBudget > 0 ? Math.min(999, (monthSpend / req.user.monthlyBudget) * 100) : null,
      }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Export endpoint: returns all requests for CSV/PDF generation client-side ── */
router.get('/export', auth, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ requests, user: { name: req.user.name, email: req.user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
