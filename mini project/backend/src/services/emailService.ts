import nodemailer from 'nodemailer';

// Email configuration - using Gmail SMTP for demo purposes
// In production, you should use a proper email service like SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'yatridungarani52@gmail.com',
    pass: process.env.EMAIL_PASS || 'dqlrpvksdahizsze'
  }
});

export interface ReservationNotificationData {
  customerName: string;
  customerEmail: string;
  reservationId: string;
  table: number;
  time: string;
  status: 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
}

export const sendReservationNotification = async (data: ReservationNotificationData): Promise<boolean> => {
  try {
    const { customerName, customerEmail, reservationId, table, time, status } = data;
    
    let subject = '';
    let message = '';
    
    switch (status) {
      case 'APPROVED':
        subject = 'Reservation Approved - Cafe Booking Confirmation';
        message = `
Dear ${customerName},

Great news! Your table reservation has been approved.

Reservation Details:
- Reservation ID: ${reservationId}
- Table: ${table}
- Date & Time: ${new Date(time).toLocaleString()}

We look forward to serving you at our cafe. Please arrive a few minutes before your reservation time.

If you need to make any changes or have questions, please contact us.

Best regards,
The Cafe Team
        `;
        break;
        
      case 'REJECTED':
        subject = 'Reservation Update - Cafe Booking';
        message = `
Dear ${customerName},

We regret to inform you that your table reservation could not be approved at this time.

Reservation Details:
- Reservation ID: ${reservationId}
- Table: ${table}
- Date & Time: ${new Date(time).toLocaleString()}

This could be due to table availability or other scheduling conflicts. We apologize for any inconvenience.

Please feel free to make a new reservation for a different time slot.

Best regards,
The Cafe Team
        `;
        break;
        
      case 'CANCELLED':
        subject = 'Reservation Cancelled - Cafe Booking';
        message = `
Dear ${customerName},

Your table reservation has been cancelled.

Reservation Details:
- Reservation ID: ${reservationId}
- Table: ${table}
- Date & Time: ${new Date(time).toLocaleString()}

If you have any questions about this cancellation, please contact us.

We hope to serve you in the future.

Best regards,
The Cafe Team
        `;
        break;
        
      case 'COMPLETED':
        subject = 'Thank You for Dining With Us - Cafe Experience Complete';
        message = `
Dear ${customerName},

Thank you for dining with us! We hope you enjoyed your experience at our cafe.

Reservation Details:
- Reservation ID: ${reservationId}
- Table: ${table}
- Date & Time: ${new Date(time).toLocaleString()}

We would love to hear about your experience. Please consider leaving us a review or feedback.

We look forward to serving you again soon!

Best regards,
The Cafe Team
        `;
        break;
        
      default:
        throw new Error(`Unknown reservation status: ${status}`);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: customerEmail,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Cafe Reservation Update</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p>Dear ${customerName},</p>
            <div style="white-space: pre-line;">${message.split('Dear ' + customerName + ',')[1]}</div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reservation notification sent to ${customerEmail} for status: ${status}`);
    return true;
    
  } catch (error) {
    console.error('Error sending reservation notification:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service configuration error:', error);
    return false;
  }
};
