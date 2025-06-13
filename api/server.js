const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const zlib = require("zlib");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json({ limit: "100mb" }));

app.use((req, res, next) => {
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Content-Security-Policy', "frame-ancestors 'self' http://localhost:5173");
  next();
});

const resourceDir = path.join(__dirname, "resources");
const globalsFilePath = path.join(__dirname, "global_data", "globals.json");
const dataMappingFilePath = path.join(
  __dirname,
  "global_data",
  "data_mapping.json"
);
const sectionsDir = path.join(__dirname, "sections");
const layoutsDir = path.join(__dirname, "layouts");
const htmlsDir = path.join(__dirname, "layout_htmls");
const rulesDir = path.join(__dirname, "rules");
const regionsFile = path.join(sectionsDir, "regions.json");
const savedReceiptsDir = path.join(__dirname, "saved-receipts");

if (!fs.existsSync(dataMappingFilePath)) {
  fs.writeFileSync(dataMappingFilePath, "{}");
}
if (!fs.existsSync(layoutsDir)) fs.mkdirSync(layoutsDir);
if (!fs.existsSync(htmlsDir)) fs.mkdirSync(htmlsDir);
// Create sections directory if it doesn't exist
if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir);
}
if (!fs.existsSync(resourceDir)) {
  fs.mkdirSync(resourceDir);
}
if (!fs.existsSync(path.dirname(globalsFilePath)))
  fs.mkdirSync(path.dirname(globalsFilePath));
if (!fs.existsSync(globalsFilePath)) fs.writeFileSync(globalsFilePath, "{}");
if (!fs.existsSync(rulesDir)) {
  fs.mkdirSync(rulesDir);
}
if (!fs.existsSync(savedReceiptsDir)) {
  fs.mkdirSync(savedReceiptsDir);
}
// Middleware
app.use(bodyParser.json({ limit: "1500mb" }));
app.use(bodyParser.urlencoded({ limit: "1500mb", extended: true }));

app.use(express.static(__dirname));
app.use("/global_data", express.static(path.join(__dirname, "global_data")));

const GLOBAL_DATA_DIR = path.join(__dirname, "global_data");
const GLOBAL_VARIABLES_PATH = path.join(GLOBAL_DATA_DIR, "globals.json");
const DATA_MAPPING_VARIABLES_PATH = path.join(
  GLOBAL_DATA_DIR,
  "data_mapping.json"
);

app.post("/save-receipt-html", (req, res) => {
  const { name, html } = req.body;

  if (!name || !html) {
    return res
      .status(400)
      .json({ error: "Missing 'name' or 'html' in request body" });
  }

  const safeFileName = name.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
  const filePath = path.join(savedReceiptsDir, `${safeFileName}.html`);

  fs.writeFile(filePath, html, "utf-8", (err) => {
    if (err) {
      console.error("Error saving receipt HTML:", err);
      return res.status(500).json({ error: "Failed to save HTML file" });
    }
    res.status(200).json({
      message: "Receipt saved successfully",
      file: `/saved-receipts/${safeFileName}.html`,
    });
  });
});

app.post("/save-rules/:sectionId", (req, res) => {
  const sectionId = req.params.sectionId;
  const { sectionRules, variableRules, sectionLogic, variableLogic } = req.body;

  const region = req.query.region;

  if (!sectionRules || !variableRules) {
    return res.status(400).send("Missing rules data");
  }

  let rulesFilePath;

  if (region) {
    // New behavior: save per region
    const regionDir = path.join(rulesDir, region);
    if (!fs.existsSync(regionDir)) {
      fs.mkdirSync(regionDir, { recursive: true });
    }
    rulesFilePath = path.join(regionDir, `${sectionId}.rules.json`);
  } else {
    // Compose file path for saving JSON rules per section
    // Use e.g. sections/section-1.rules.json
    rulesFilePath = path.join(sectionsDir, `${sectionId}.rules.json`);
  }

  const rulesData = {
    sectionRules,
    variableRules,
    sectionLogic,
    variableLogic,
  };

  fs.writeFile(rulesFilePath, JSON.stringify(rulesData, null, 2), (err) => {
    if (err) {
      console.error("Error saving rules:", err);
      return res.status(500).send("Failed to save rules");
    }
    res.send(`Rules for ${sectionId} saved successfully`);
  });
});

app.get("/get-rules/:sectionId", (req, res) => {
  const sectionId = req.params.sectionId;
  const region = req.query.region;

  let rulesFilePath;

  if (region) {
    // New behavior: load per region
    rulesFilePath = path.join(rulesDir, region, `${sectionId}.rules.json`);
  } else {
    // Old behavior: global load
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

function loadRegions() {
  if (!fs.existsSync(regionsFile)) return {};
  const data = fs.readFileSync(regionsFile, "utf-8");
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveRegions(data) {
  fs.writeFileSync(regionsFile, JSON.stringify(data, null, 2), "utf-8");
}

app.get("/region/:sectionId", (req, res) => {
  const { sectionId } = req.params;
  const regions = loadRegions();
  const region = regions[sectionId] || "";
  res.json({ sectionId, region });
});

app.post("/region/:sectionId", (req, res) => {
  const { sectionId } = req.params;
  const { region } = req.body;

  if (typeof region !== "string") {
    return res.status(400).json({ error: "Region must be a string" });
  }

  const regions = loadRegions();
  regions[sectionId] = region;
  saveRegions(regions);

  res.json({ message: `Region for section ${sectionId} updated.`, region });
});

app.get("/datamapping", (req, res) => {
  fs.readFile(dataMappingFilePath, "utf-8", (err, data) => {
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

app.post("/datamapping", (req, res) => {
  const newDataMapping = req.body;

  fs.writeFile(
    dataMappingFilePath,
    JSON.stringify(newDataMapping, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving data mapping:", err);
        return res.status(500).send("Failed to save data mapping.");
      }
      res.send("Data mapping saved successfully.");
    }
  );
});

app.get("/api/global-variables", (req, res) => {
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
      return res
        .status(500)
        .json({ error: "Invalid JSON format in global variables" });
    }

    // Now read the data mapping variables
    fs.readFile(DATA_MAPPING_VARIABLES_PATH, "utf-8", (err, mappingData) => {
      if (err) {
        console.error("Error reading data mapping variables:", err);
        return res
          .status(500)
          .json({ error: "Failed to load data mapping variables" });
      }

      let mappingParsed;
      try {
        mappingParsed = JSON.parse(mappingData);
      } catch (parseErr) {
        console.error("Error parsing data mapping variables JSON:", parseErr);
        return res
          .status(500)
          .json({ error: "Invalid JSON format in data mapping variables" });
      }
      const combined = { ...globalParsed, ...mappingParsed };
      return res.json(combined);
    });
  });
});

app.get("/globals", (req, res) => {
  const data = fs.readFileSync(globalsFilePath, "utf-8");
  res.json(JSON.parse(data));
});

app.post("/globals", (req, res) => {
  const newGlobals = req.body;

  fs.writeFile(globalsFilePath, JSON.stringify(newGlobals, null, 2), (err) => {
    if (err) return res.status(500).send("Failed to save data.");
    res.send("Globals saved successfully.");
  });
});

app.use("/layout-htmls", express.static(path.join(__dirname, "layout-htmls")));
// Serve the sections folder statically (for e.g., section-1.html, section-2.html)
app.use("/sections", express.static(path.join(__dirname, "sections")));

app.get("/load-resource-bundle", (req, res) => {
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

app.post("/save-resource-bundle", (req, res) => {
  const language = req.query.lang;
  const filePath = path.join(resourceDir, `${language}.properties`);
  const keyValuePairs = req.body;

  const lines = Object.entries(keyValuePairs).map(
    ([key, value]) => `${key}=${value}`
  );
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Replace with the actual path to your HTML file
});

// Route to get section content (auto-creates file if missing)
// Route to get section content (auto-creates file if missing)
app.get("/get-section/:id", (req, res) => {
  const sectionId = req.params.id;
  const filePath = path.join(__dirname, "sections", `${sectionId}.html`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create it with default HTML content
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
          return res
            .status(500)
            .json({ error: "Failed to create default file" });
        }
        // Return as JSON
        res.json({ content: defaultContent });
      });
    } else {
      // File exists, return its content as JSON
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

app.post("/save-section/:id", (req, res) => {
  const sectionId = req.params.id;
  const { content } = req.body;
  const filePath = path.join(sectionsDir, `${sectionId}.html`);

  fs.writeFileSync(filePath, content, "utf-8");
  res.send("Content saved successfully.");
});

app.use((req, res, next) => {
  const size = req.headers["content-length"];
  if (size) {
    console.log(`Incoming request size: ${(size / 1024).toFixed(2)} KB`);
  }
  next();
});

// POST route to save layout
app.post("/save-layout", (req, res) => {
  const { imageData, layoutHTML, filename } = req.body;
  if (!imageData || !layoutHTML || !filename) {
    return res.status(400).send("Missing required fields");
  }

  // Save image
  const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
  const imagePath = path.join(layoutsDir, `${filename}.png`);
  const htmlPath = path.join(htmlsDir, `${filename}.html`);

  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      console.error("Image save error:", err);
      return res.status(500).send("Failed to save image");
    }

    // Save HTML
    fs.writeFile(htmlPath, layoutHTML, (err) => {
      if (err) {
        console.error("HTML save error:", err);
        return res.status(500).send("Failed to save HTML");
      }

      res.send("Layout saved successfully!");
    });
  });
});

// API route to get layout images and their corresponding HTML files
app.get("/get-layout-images", (req, res) => {
  fs.readdir(layoutsDir, (err, imageFiles) => {
    if (err) {
      return res.status(500).send("Error reading layouts directory");
    }

    // Filter for image files (skip directories)
    const imageFilesFiltered = imageFiles.filter((file) => {
      return (
        file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")
      );
    });

    const layoutData = imageFilesFiltered.map((imageFile) => {
      // Extract the base name (remove extension)
      const baseName = imageFile.split(".")[0];

      const imagePath = `/layouts/${imageFile}`;
      const htmlFilePath = `/layout_htmls/${baseName}.html`;

      return {
        heading: `Layout ${baseName.replace("layout", "")}`, // Generate heading as "Layout 1", "Layout 2", etc.
        image: imagePath,
        htmlFile: htmlFilePath,
      };
    });

    res.json(layoutData); // Send the image and HTML data as a response
  });
});

// Serve the frontend HTML (static files)
app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
