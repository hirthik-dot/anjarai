// server/utils/mailer.js
require('dotenv').config();
const { Resend } = require('resend');
const nodemailer = require('nodemailer');

// ── Resend client (production) ──────────────────────────────────────────────
let resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

// ── Nodemailer fallback (local dev with Gmail) ──────────────────────────────
let transporter;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout:   10000,
    socketTimeout:     15000,
  });
  return transporter;
}

// ── Decide which provider to use ────────────────────────────────────────────
// Use Resend if RESEND_API_KEY is set, otherwise fall back to Gmail/SMTP
function useResend() {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Build the OTP email HTML
 */
function buildOtpHtml(name, otp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f9f9f5;font-family:'Nunito',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:20px;overflow:hidden;
                      box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#2d6a4f;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;
                         color:#ffffff;font-weight:700;letter-spacing:-0.5px;">
                The <span style="color:#f4a261;">Anjaraipetti</span>
              </h1>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.65);
                        text-transform:uppercase;letter-spacing:1.5px;">
                Your Login Code
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:16px;color:#1b1b1b;font-weight:700;">
                Hi ${name}! 👋
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#666666;line-height:1.6;">
                Here is your one-time password to log in to The Anjaraipetti.
                This code expires in <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#d8f3dc;border-radius:16px;padding:28px;
                          text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;
                           color:#2d6a4f;text-transform:uppercase;letter-spacing:2px;">
                  Your OTP Code
                </p>
                <div style="font-size:44px;font-weight:900;letter-spacing:14px;
                            color:#2d6a4f;font-family:Georgia,serif;line-height:1;">
                  ${otp}
                </div>
              </div>

              <p style="margin:0 0 6px;font-size:13px;color:#666666;line-height:1.6;">
                ⚠️ <strong>Do not share this code</strong> with anyone.
                The Anjaraipetti will never ask you for your OTP.
              </p>
              <p style="margin:0;font-size:13px;color:#666666;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f5;padding:20px 40px;border-top:1px solid #eee;">
              <p style="margin:0;font-size:11px;color:#999999;text-align:center;line-height:1.6;">
                © 2026 The Anjaraipetti · Tamil Nadu, India<br/>
                FSSAI Certified · 100% Organic · Made with ❤️
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send OTP email to user
 * @param {string} to    - recipient email
 * @param {string} name  - recipient name
 * @param {string} otp   - 6-digit OTP string
 */
async function sendOtpEmail(to, name, otp) {
  const html = buildOtpHtml(name, otp);
  const text = `Hi ${name},\n\nYour OTP for The Anjaraipetti is: ${otp}\n\nThis code expires in 10 minutes.\nDo not share this with anyone.\n\n– The Anjaraipetti Team`;
  const subject = `${otp} is your The Anjaraipetti login code`;
  const from = process.env.MAIL_FROM || 'The Anjaraipetti <onboarding@resend.dev>';

  try {
    if (useResend()) {
      // ── Resend (production / cloud) ─────────────────────────────────
      const { data, error } = await getResend().emails.send({
        from,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        throw new Error(error.message || 'Resend API returned an error');
      }

      console.log(`✅ OTP Email sent via Resend to ${to}: ${data?.id}`);
      return data;

    } else {
      // ── Nodemailer / Gmail fallback (local dev) ─────────────────────
      const info = await getTransporter().sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(`✅ OTP Email sent via Gmail to ${to}: ${info.messageId}`);
      return info;
    }

  } catch (err) {
    console.error('❌ CRITICAL MAIL FAILURE:', {
      provider: useResend() ? 'Resend' : 'Gmail/SMTP',
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
    });
    throw err;
  }
}

module.exports = { sendOtpEmail };
