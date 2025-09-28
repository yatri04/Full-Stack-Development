MERN Portfolio Contact (Demo)
=============================

What this does
- React frontend with a contact form (name, email, message).
- Express backend endpoint /api/contact that validates inputs and sends email using NodeMailer.
- Server reads EMAIL_USER and EMAIL_PASS from .env (see server/.env.example).

Quick start
1. Start server:
   cd server
   npm install
   Create .env from .env.example and fill EMAIL_USER and EMAIL_PASS
   npm start
2. Start client:
   cd client
   npm install
   npm start
3. Open http://localhost:3000 and send a test message.

Security notes
- Do NOT commit your .env file to source control.
- For Gmail, enable 2-step verification and create an App Password for EMAIL_PASS.
