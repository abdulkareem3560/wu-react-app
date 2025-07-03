const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const rulesDir = path.join(__dirname, '..', 'rules');
const sectionsDir = path.join(__dirname, '..', 'sections');

// POST save rules
router.post('/:sectionId', (req, res) => {
  const sectionId = req.params.sectionId;
  const { sectionRules, variableRules, sectionLogic, variableLogic } = req.body;
  const region = req.query.region;

  if (!sectionRules || !variableRules) {
    return res.status(400).send("Missing rules data");
  }

  let rulesFilePath;
  if (region) {
    const regionDir = path.join(rulesDir, region);
    if (!fs.existsSync(regionDir)) {
      fs.mkdirSync(regionDir, { recursive: true });
    }
    rulesFilePath = path.join(regionDir, `${sectionId}.rules.json`);
  } else {
    rulesFilePath = path.join(sectionsDir, `${sectionId}.rules.json`);
  }

  const rulesData = { sectionRules, variableRules, sectionLogic, variableLogic };

  fs.writeFile(rulesFilePath, JSON.stringify(rulesData, null, 2), (err) => {
    if (err) {
      console.error("Error saving rules:", err);
      return res.status(500).send("Failed to save rules");
    }
    res.send(`Rules for ${sectionId} saved successfully`);
  });
});

// GET rules
router.get('/:sectionId', (req, res) => {
  const sectionId = req.params.sectionId;
  const region = req.query.region;

  let rulesFilePath;
  if (region) {
    rulesFilePath = path.join(rulesDir, region, `${sectionId}.rules.json`);
  } else {
    rulesFilePath = path.join(sectionsDir, `${sectionId}.rules.json`);
  }

  if (!fs.existsSync(rulesFilePath)) {
    return res.json({
      sectionRules: [],
      variableRules: [],
      sectionLogic: null,
      variableLogic: [],
    });
  }

  try {
    const rules = JSON.parse(fs.readFileSync(rulesFilePath, "utf-8"));
    res.json(rules);
  } catch (err) {
    console.error("Error reading rules file:", err);
    res.status(500).json({
      sectionRules: [],
      variableRules: [],
      sectionLogic: null,
      variableLogic: [],
    });
  }
});

module.exports = router;
