const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const GLOBAL_DATA_DIR = path.join(__dirname, '..', 'global_data');
const GLOBAL_VARIABLES_PATH = path.join(GLOBAL_DATA_DIR, 'globals.json');
const DATA_MAPPING_VARIABLES_PATH = path.join(GLOBAL_DATA_DIR, 'data_mapping.json');

// GET global variables (combined)
router.get('/', (req, res) => {
  fs.readFile(GLOBAL_VARIABLES_PATH, "utf-8", (err, globalData) => {
    if (err) {
      console.error("Error reading global variables:", err);
      return res.status(500).json({ error: "Failed to load global variables" });
    }
    let globalParsed;
    try {
      globalParsed = JSON.parse(globalData);
    } catch (parseErr) {
      console.error("Error parsing global variables JSON:", parseErr);
      return res.status(500).json({ error: "Invalid JSON format in global variables" });
    }
    fs.readFile(DATA_MAPPING_VARIABLES_PATH, "utf-8", (err, mappingData) => {
      if (err) {
        console.error("Error reading data mapping variables:", err);
        return res.status(500).json({ error: "Failed to load data mapping variables" });
      }
      let mappingParsed;
      try {
        mappingParsed = JSON.parse(mappingData);
      } catch (parseErr) {
        console.error("Error parsing data mapping variables JSON:", parseErr);
        return res.status(500).json({ error: "Invalid JSON format in data mapping variables" });
      }
      const combined = { ...globalParsed, ...mappingParsed };
      return res.json(combined);
    });
  });
});

// GET only globals
router.get('/only', (req, res) => {
  const data = fs.readFileSync(GLOBAL_VARIABLES_PATH, "utf-8");
  res.json(JSON.parse(data));
});

// POST update globals
router.post('/', (req, res) => {
  const newGlobals = req.body;
  fs.writeFile(GLOBAL_VARIABLES_PATH, JSON.stringify(newGlobals, null, 2), (err) => {
    if (err) return res.status(500).send("Failed to save data.");
    res.send("Globals saved successfully.");
  });
});

// GET data mapping
router.get('/datamapping', (req, res) => {
  fs.readFile(DATA_MAPPING_VARIABLES_PATH, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading data mapping:", err);
      return res.status(500).json({ error: "Failed to load data mapping" });
    }
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      console.error("Error parsing data mapping JSON:", parseErr);
      res.status(500).json({ error: "Invalid JSON format in data mapping" });
    }
  });
});

// POST update data mapping
router.post('/datamapping', (req, res) => {
  const newDataMapping = req.body;
  fs.writeFile(DATA_MAPPING_VARIABLES_PATH, JSON.stringify(newDataMapping, null, 2), (err) => {
    if (err) {
      console.error("Error saving data mapping:", err);
      return res.status(500).send("Failed to save data mapping.");
    }
    res.send("Data mapping saved successfully.");
  });
});

module.exports = router;
