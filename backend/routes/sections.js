const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const sectionsDir = path.join(__dirname, '..', 'sections');

// GET section content (auto-creates if missing)
router.get('/:id', (req, res) => {
  const sectionId = req.params.id;
  const filePath = path.join(sectionsDir, `${sectionId}.html`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Create default content
      const defaultContent = `
        <div style="padding: 20px;">
          <h2>${sectionId}</h2>
          <p>This is the default content for <strong>${sectionId}</strong>.</p>
          <p>You can use {{variables}} inside this editor.</p>
        </div>
      `.trim();

      fs.writeFile(filePath, defaultContent, "utf-8", (writeErr) => {
        if (writeErr) {
          console.error("Error creating default section file:", writeErr);
          return res.status(500).json({ error: "Failed to create default file" });
        }
        res.json({ content: defaultContent });
      });
    } else {
      fs.readFile(filePath, "utf-8", (readErr, data) => {
        if (readErr) {
          console.error("Error reading section file:", readErr);
          return res.status(500).json({ error: "Failed to read section file" });
        }
        res.json({ content: data });
      });
    }
  });
});

// POST save section content
router.post('/:id', (req, res) => {
  const sectionId = req.params.id;
  const { content } = req.body;
  const filePath = path.join(sectionsDir, `${sectionId}.html`);
  fs.writeFileSync(filePath, content, "utf-8");
  res.send("Content saved successfully.");
});

module.exports = router;
