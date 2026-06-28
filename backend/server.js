const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
try { require('@dotenvx/dotenvx').config(); } catch { require('dotenv').config(); }

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const statsRoutes = require('./routes/stats');
const settingsRoutes = require('./routes/settings');

const app = express();

app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all localhost origins
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
