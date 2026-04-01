// server/utils/sendOtp.js — Email OTP via Resend (in-memory Map store)
const { Resend } = require('resend');
const crypto = require('crypto');

const resend = new Resend(process.env.RESEND_API_KEY);
const otpStore = new Map();

// ── generateOtp — cryptographically random 6-digit OTP ───────────────────────
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// ── saveOtp — store OTP in Map with 5 min expiry + attempt counter ───────────
function saveOtp(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });
}

// ── verifyOtp — check expiry, max 3 attempts, delete after success ───────────
function verifyOtp(email, inputOtp) {
  const record = otpStore.get(email);
  if (!record) return { success: false, reason: 'OTP not found' };
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return { success: false, reason: 'OTP expired' };
  }
  if (record.attempts >= 3) {
    otpStore.delete(email);
    return { success: false, reason: 'Too many attempts' };
  }
  if (record.otp !== inputOtp) {
    record.attempts++;
    return { success: false, reason: 'Invalid OTP' };
  }
  otpStore.delete(email);
  return { success: true };
}

// ── sendOtp — send OTP email via Resend API ──────────────────────────────────
async function sendOtp(email) {
  const otp = generateOtp();
  saveOtp(email, otp);

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Your Anjaraipetti verification code',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e0e0e0">
        <h2 style="color:#2d6a4f">Anjaraipetti Foods 🌿</h2>
        <p style="color:#555">Use the code below to login. Valid for 5 minutes.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#2d6a4f;padding:16px 0">${otp}</div>
        <p style="color:#999;font-size:12px">Do not share this with anyone.</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

module.exports = { generateOtp, saveOtp, verifyOtp, sendOtp };
