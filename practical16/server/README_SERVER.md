Server (Express + NodeMailer)
----------------------------

Setup:
  cd server
  npm install

Create a .env in the server folder (copy from .env.example):
  EMAIL_USER=your_email@example.com
  EMAIL_PASS=your_email_app_password

Run:
  npm start
or for development with auto-restart:
  npm run dev

Notes:
- This uses nodemailer with SMTP credentials from .env.
- For Gmail, enable 2-step verification and create an App Password, then use that as EMAIL_PASS.
- For production, secure the .env and don't commit it to source control.
