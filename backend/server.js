const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "1500mb" }));
app.use(bodyParser.urlencoded({ limit: "1500mb", extended: true }));

// Security headers
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Content-Security-Policy', "frame-ancestors 'self' https://wu-react-app-3.onrender.com http://localhost:*");
  next();
});

// Static folders
app.use(express.static(__dirname));
app.use("/global_data", express.static("global_data"));
app.use("/layout-htmls", express.static("layout_htmls"));
app.use("/sections", express.static("sections"));
app.use(express.static("public"));

// Route modules
app.use('/receipts', require('./routes/receipts'));
app.use('/sections', require('./routes/sections'));
app.use('/rules', require('./routes/rules'));
app.use('/globals', require('./routes/globals'));
app.use('/layouts', require('./routes/layouts'));
app.use('/resources', require('./routes/resources'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
