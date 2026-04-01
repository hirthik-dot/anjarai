// server/utils/sendOtp.js — Phone OTP via Fast2SMS (in-memory Map store)
const crypto = require('crypto');
const https  = require('https');

// ── In-memory OTP store ──────────────────────────────────────────────────────
// Key: phone, Value: { otp, expiresAt, attempts }
const otpStore = new Map();

// ── In-memory rate-limit store ───────────────────────────────────────────────
// Key: phone, Value: timestamp of last OTP sent
const rateLimitStore = new Map();

// ── stripPrefix — remove +91 or 91 prefix, return bare 10-digit number ───────
function stripPrefix(phone) {
  let p = String(phone || '').trim().replace(/\s+/g, '');
  if (p.startsWith('+91')) p = p.slice(3);
  else if (p.startsWith('91') && p.length > 10) p = p.slice(2);
  return p;
}

// ── generateOtp — cryptographically random 6-digit OTP ───────────────────────
function generateOtp() {
  const bytes = crypto.randomBytes(4);
  const num   = bytes.readUInt32BE(0) % 1000000;
  return String(num).padStart(6, '0');
}

// ── saveOtp — store OTP in Map with 5 min expiry + attempt counter ───────────
function saveOtp(phone, otp) {
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  });

  // Auto-cleanup after expiry (prevent memory leak)
  setTimeout(() => {
    const record = otpStore.get(phone);
    if (record && Date.now() >= record.expiresAt) {
      otpStore.delete(phone);
    }
  }, 5 * 60 * 1000 + 1000);
}

// ── verifyOtp — check expiry, max 3 attempts, delete after success ───────────
function verifyOtp(phone, inputOtp) {
  const cleanPhone = stripPrefix(phone);
  const record = otpStore.get(cleanPhone);

  if (!record) {
    return { success: false, error: 'No active OTP found. Please request a new one.' };
  }

  // Check expiry
  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  // Check max attempts (3)
  if (record.attempts >= 3) {
    otpStore.delete(cleanPhone);
    return { success: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  // Compare OTP
  if (record.otp !== String(inputOtp).trim()) {
    record.attempts++;
    const remaining = 3 - record.attempts;
    return {
      success: false,
      error: remaining > 0
        ? `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        : 'Incorrect OTP. No attempts remaining. Please request a new OTP.',
      attemptsRemaining: Math.max(0, remaining),
    };
  }

  // Success — delete OTP record
  otpStore.delete(cleanPhone);
  return { success: true };
}

// ── isRateLimited — 1 OTP per minute per phone number ────────────────────────
function isRateLimited(phone) {
  const lastSent = rateLimitStore.get(phone);
  if (!lastSent) return false;
  return (Date.now() - lastSent) < 60 * 1000; // 60 seconds
}

function setRateLimit(phone) {
  rateLimitStore.set(phone, Date.now());

  // Auto-cleanup after 2 minutes
  setTimeout(() => rateLimitStore.delete(phone), 2 * 60 * 1000);
}

// ── sendOtp — call Fast2SMS bulkV2 API, throw on failure ─────────────────────
async function sendOtp(phone) {
  const apiKey = process.env.FAST2SMS_API_KEY;

  // Debug: log whether the key is loaded
  console.log('🔑 FAST2SMS_API_KEY loaded:', apiKey ? `Yes (${apiKey.length} chars)` : '❌ UNDEFINED');

  if (!apiKey) throw new Error('FAST2SMS_API_KEY is not configured in .env');

  // Strip +91 / 91 prefix — Fast2SMS expects bare 10-digit number
  const barePhone = stripPrefix(phone);
  console.log(`📱 Sending OTP to barePhone: ${barePhone} (original: ${phone})`);

  const otp = generateOtp();
  saveOtp(barePhone, otp);

  // Build URL-encoded body
  const params = new URLSearchParams({
    route: 'otp',
    variables_values: otp,
    flash: '0',
    numbers: barePhone,
  });
  const postData = params.toString();

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.fast2sms.com',
      path:     '/dev/bulkV2',
      method:   'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type':  'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Cache-Control': 'no-cache',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        // Log RAW response BEFORE any parsing
        console.log('📱 Fast2SMS RAW response status:', res.statusCode);
        console.log('📱 Fast2SMS RAW body:', body);

        try {
          const parsed = JSON.parse(body);
          console.log('📱 Fast2SMS Parsed:', JSON.stringify(parsed, null, 2));

          if (parsed.return === true) {
            console.log(`✅ OTP sent to ${barePhone} via Fast2SMS`);
            resolve(otp);
          } else {
            otpStore.delete(barePhone);
            const errMsg = Array.isArray(parsed.message)
              ? parsed.message[0]
              : (parsed.message || 'Failed to send OTP via Fast2SMS');
            reject(new Error(errMsg));
          }
        } catch (e) {
          otpStore.delete(barePhone);
          reject(new Error(`Invalid JSON from Fast2SMS: ${body.slice(0, 200)}`));
        }
      });
    });

    req.on('error', (err) => {
      otpStore.delete(barePhone);
      reject(new Error(`Fast2SMS request failed: ${err.message}`));
    });

    req.setTimeout(15000, () => {
      otpStore.delete(barePhone);
      req.destroy();
      reject(new Error('Fast2SMS request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { generateOtp, saveOtp, verifyOtp, sendOtp, isRateLimited, setRateLimit, stripPrefix };
