const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const savedReceiptsDir = path.join(__dirname, '..', 'saved-receipts');

// GET saved receipts
router.get('/', (req, res) => {
  fs.readdir(savedReceiptsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch saved receipts' });
    }
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    const receipts = htmlFiles.map(file => {
      const filePath = path.join(savedReceiptsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return { name: file, content: fileContent };
    });
    res.json(receipts);
  });
});

// POST save receipt
router.post('/save', (req, res) => {
  const { name, html } = req.body;
  if (!name || !html) {
    return res.status(400).json({ error: "Missing 'name' or 'html' in request body" });
  }
  const safeFileName = path.basename(name).replace(/[^a-zA-Z0-9_\-\.]/g, '');
  if (!safeFileName.endsWith('.html')) {
    return res.status(400).json({ error: "Invalid file extension" });
  }
  const filePath = path.join(savedReceiptsDir, safeFileName);
  fs.writeFile(filePath, html, "utf-8", (err) => {
    if (err) {
      console.error("Error saving receipt HTML:", err);
      return res.status(500).json({ error: "Failed to save HTML file" });
    }
    res.status(200).json({ message: "Receipt saved successfully", file: `/saved-receipts/${safeFileName}` });
  });
});

// POST delete receipt
router.post('/delete', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Missing 'name' in request body" });
  }
  const safeFileName = path.basename(name).replace(/[^a-zA-Z0-9_\-\.]/g, '');
  if (!safeFileName.endsWith('.html')) {
    return res.status(400).json({ error: "Invalid file extension" });
  }
  const filePath = path.join(savedReceiptsDir, safeFileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting receipt:", err);
      return res.status(500).json({ error: "Failed to delete receipt" });
    }
    res.status(200).json({ message: "Receipt deleted successfully" });
  });
});

module.exports = router;
