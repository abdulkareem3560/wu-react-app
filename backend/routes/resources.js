const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const resourceDir = path.join(__dirname, '..', 'resources');

// GET resource bundle
router.get('/bundle', (req, res) => {
  const language = req.query.lang;
  const filePath = path.join(resourceDir, `${language}.properties`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf-8");
    return res.json({ success: true, content: {} });
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  const keyValuePairs = {};
  for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      keyValuePairs[key] = value;
    }
  }
  res.json({ success: true, content: keyValuePairs });
});

// POST save resource bundle
router.post('/bundle', (req, res) => {
  const language = req.query.lang;
  const filePath = path.join(resourceDir, `${language}.properties`);
  const keyValuePairs = req.body;
  const lines = Object.entries(keyValuePairs).map(
    ([key, value]) => `${key}=${value}`
  );
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  res.json({ success: true });
});

module.exports = router;
