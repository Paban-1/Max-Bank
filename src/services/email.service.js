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
    const text = `Hello ${name},\n\nThank you for registering with Bank Lima. We are excited to have you on board!\n\nBest regards,\nBank Lima Team<br><b>( This is a test Emaling form The Backend Do not need to panic, after this email your registration will be canceled )</b>`;

    const html = `<p>Hello ${name},</p><p>Thank you for registering with <strong>Bank Lima</strong>. We are excited to have you on board!</p><p>Best regards,<br/>Bank Lima Team</p><p><b>( This is a test Emaling form The Backend Do not need to panic, after this email your registration will be canceled )</b></p>`;

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount){
const subject = 'Sucessfully Transfer';
    const text = `Hello ${name},\n\nyour ${amount} has dedcted from you account to ${toAccount}.\n\nBest regards,\nBank Lima Team`;

    const html = `<p>Hello ${name},</p><p>Thank you for Transaction with <strong>Bank Lima</strong>. We are excited to have you on board!</p><p>Best regards,<br/>Bank Lima Team</p>`;

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount){

}


module.exports = {
    sendRegistartionEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};