const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic CORS so the React dev server (localhost:3000) can talk to this API.
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// NOTE: MemoryStore is fine for demo / dev but not for production.
app.use(session({
  name: 'mern_session_id',
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Login - expects { name: "Alice" }
app.post('/api/login', (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Name is required' });

  req.session.name = name;
  req.session.login_time = new Date().toISOString();
  return res.json({ ok: true, message: 'Logged in', name: req.session.name, login_time: req.session.login_time });
});

// Profile - returns session info if logged in
app.get('/api/profile', (req, res) => {
  if (!req.session.name) return res.status(401).json({ error: 'Not logged in' });
  return res.json({ name: req.session.name, login_time: req.session.login_time });
});

// Logout - destroys session
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Failed to destroy session' });
    // Clear cookie on client
    res.clearCookie('mern_session_id');
    return res.json({ ok: true, message: 'Logged out' });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
