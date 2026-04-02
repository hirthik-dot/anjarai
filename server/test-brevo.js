// Temporary test script — delete after testing
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('BREVO_SMTP_LOGIN:', process.env.BREVO_SMTP_LOGIN);
console.log('BREVO_SMTP_KEY length:', process.env.BREVO_SMTP_KEY?.length);
console.log('BREVO_SMTP_KEY starts with:', process.env.BREVO_SMTP_KEY?.substring(0, 15));

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Verification failed:', error.message);
    console.error('   Response:', error.response);
    console.error('   Code:', error.code);
  } else {
    console.log('✅ Brevo SMTP is connected and ready!');
    
    // Try sending a test emaill
    transporter.sendMail({
      from: `Test <${process.env.BREVO_SMTP_LOGIN}>`,
      to: process.env.BREVO_SMTP_LOGIN,
      subject: 'Brevo Test',
      text: 'This is a test email from Anjaraipetti server.',
    }, (err, info) => {
      if (err) console.error('❌ Send failed:', err.message);
      else console.log('✅ Test email sent! ID:', info.messageId);
    });
  }
});
