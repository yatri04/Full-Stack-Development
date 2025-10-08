# Email Notification Setup

This document explains how to set up email notifications for reservation status changes.

## Configuration

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 2. Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password (not your regular password) in `EMAIL_PASS`

### 3. Alternative Email Services

For production, consider using:
- **SendGrid** - Professional email service
- **Mailgun** - Developer-friendly email API
- **Amazon SES** - AWS email service

To use these services, modify the `emailService.ts` file to use their respective SMTP settings or APIs.

## Features

The email notification system automatically sends emails when:

- ✅ **Reservation Approved** - Customer receives confirmation
- ❌ **Reservation Rejected** - Customer is notified of rejection
- 🚫 **Reservation Cancelled** - Customer is informed of cancellation
- 🎉 **Reservation Completed** - Customer receives thank you message

## Testing

To test the email service, you can:

1. Start the backend server
2. Update a reservation status through the admin panel
3. Check the server logs for email sending status
4. Verify the customer receives the email

## Troubleshooting

- **"Invalid login"** - Check your email credentials and app password
- **"Connection timeout"** - Verify your internet connection and Gmail settings
- **Emails not received** - Check spam folder and email address accuracy

## Production Considerations

- Use a dedicated email service (SendGrid, Mailgun, etc.)
- Implement email templates for better formatting
- Add email delivery tracking and retry logic
- Consider rate limiting for email sending
- Set up proper error handling and logging
