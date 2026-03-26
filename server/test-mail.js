const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function test() {
  try {
    console.log('Attempting to send test email...');
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_USER, // Send to self
      subject: 'Test Email from Anjaraipetti',
      text: 'If you see this, email is working!',
    });
    console.log('✅ Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Email failed:', err);
  }
}

test();
