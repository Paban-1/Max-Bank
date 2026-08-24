const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bank Lima" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistartionEmail(userEmail, name) {
    const subject = 'Welcome to Bank Lima';
    const text = `Hello ${name},

Thank you for registering with Bank Lima. We are excited to have you on board!

Best regards,
Bank Lima Team

(Note: This is a test email from the backend. No action is required; your test registration will be canceled automatically.)`;

    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Welcome to Bank Lima!</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for registering with <strong>Bank Lima</strong>. We are excited to have you on board!</p>
    
    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>The Bank Lima Team</strong>
    </p>

    <div style="margin-top: 24px; padding: 12px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; color: #856404; font-size: 13px;">
      <strong>Note:</strong> This is a test email from the backend. No action is required; your test registration will be canceled automatically.
    </div>
  </div>
`;

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful !';
    const text = `Hello ${name},\n\nYour transaction of ₹${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Bank Lima Team`;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
      <h2 style="color: #28a745; margin-top: 0;">Transaction Successful!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> was successful.</p>
      
      <p style="margin-top: 24px; margin-bottom: 0;">
        Best regards,<br>
        <strong>The Bank Lima Team</strong>
      </p>
    </div>
  `;

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Failed";
    const text = `Hello ${name},

We regret to inform you that your transaction of ₹${amount} to account ${toAccount} could not be completed.

If any money was debited from your account, it will be automatically refunded within 3–5 business days.

If you have any questions, please contact our support team.

Regards,
Support Team`;
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
      <h2 style="color: #d9534f; margin-top: 0;">Transaction Failed</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We regret to inform you that your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> could not be completed.</p>
      
      <p style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; border: 1px solid #f5c6cb;">
        If any money was debited from your account, it will be automatically refunded within <strong>3–5 business days</strong>.
      </p>

      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        If you need assistance, feel free to reach out to our support team.
      </p>
      <p style="margin-bottom: 0;">Regards,<br><strong>Support Team</strong></p>
    </div>
  `;

    return {
        to: userEmail,
        subject,
        text,
        html,
    };
}


module.exports = {
    sendRegistartionEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};