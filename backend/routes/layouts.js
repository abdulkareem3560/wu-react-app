const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const layoutsDir = path.join(__dirname, '..', 'layouts');
const htmlsDir = path.join(__dirname, '..', 'layout_htmls');

// POST save layout
router.post('/save', (req, res) => {
  const { imageData, layoutHTML, filename } = req.body;
  if (!imageData || !layoutHTML || !filename) {
    return res.status(400).send("Missing required fields");
  }
  const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
  const imagePath = path.join(layoutsDir, `${filename}.png`);
  const htmlPath = path.join(htmlsDir, `${filename}.html`);
  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      console.error("Image save error:", err);
      return res.status(500).send("Failed to save image");
    }
    fs.writeFile(htmlPath, layoutHTML, (err) => {
      if (err) {
        console.error("HTML save error:", err);
        return res.status(500).send("Failed to save HTML");
      }
      res.send("Layout saved successfully!");
    });
  });
});

// GET layout images and HTMLs
router.get('/images', (req, res) => {
  fs.readdir(layoutsDir, (err, imageFiles) => {
    if (err) {
      return res.status(500).send("Error reading layouts directory");
    }
    const imageFilesFiltered = imageFiles.filter((file) => {
      return (
        file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")
      );
    });
    const layoutData = imageFilesFiltered.map((imageFile) => {
      const baseName = imageFile.split(".")[0];
      const imagePath = `/layouts/${imageFile}`;
      const htmlFilePath = `/layout_htmls/${baseName}.html`;
      return {
        heading: `Layout ${baseName.replace("layout", "")}`,
        image: imagePath,
        htmlFile: htmlFilePath,
      };
    });
    res.json(layoutData);
  });
});

module.exports = router;
