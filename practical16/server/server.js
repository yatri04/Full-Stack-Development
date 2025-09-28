const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic CORS for local dev
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// Simple rate limiter to prevent abuse (adjust as needed)
const limiter = rateLimit({ windowMs: 60*1000, max: 10 });
app.use('/api/contact', limiter);

function validateEmail(email) { 
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(String(email).toLowerCase());
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    // Basic validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !validateEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

    // Create transporter using SMTP credentials from .env
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error('EMAIL_USER or EMAIL_PASS not set in environment');
      return res.status(500).json({ error: 'Email not configured on server. See README.' });
    }

    // Using Gmail SMTP by default; supports other SMTP providers
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
      secure: process.env.EMAIL_PORT ? (process.env.EMAIL_PORT === '465') : true,
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${user}>`,
      to: user,
      subject: `Portfolio message from ${name} <${email}>`,
      text: `You received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `<p>You received a new message from your portfolio contact form.</p>
             <p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);
    return res.json({ ok: true, message: 'Message sent successfully' });

  } catch (err) {
    console.error('Error in /api/contact', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
