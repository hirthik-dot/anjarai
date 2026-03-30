const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Map public URL keys to markdown files in /data
const POLICY_FILES = {
  terms: 'terms&condition.md',
  privacy: 'privacy_policy.md',
  shipping: 'shipping_policy.md',
  refund: 'retrun_policy.md',
  cookie: null,
  cancellation: null,
};

function parseMarkdownTitle(raw) {
  const normalized = String(raw || '').replace(/\r\n/g, '\n').trimEnd();
  const lines = normalized.split('\n');
  const title = (lines[0] || '').trim();
  const body = lines.slice(1).join('\n').trim();
  return { title, content: body };
}

router.get('/:key', async (req, res) => {
  try {
    const key = String(req.params.key || '').toLowerCase();
    const file = POLICY_FILES[key];

    if (!file) {
      return res.status(200).json({
        title: key === 'cookie' ? 'Cookie Policy' : 'Cancellation Policy',
        content: 'Coming soon.',
      });
    }

    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Policy file not found' });
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = parseMarkdownTitle(raw);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

