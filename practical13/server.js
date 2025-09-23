const express = require("express");
const path = require("path");
const fs = require("fs-extra");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Path to data file
const DATA_FILE = path.join(__dirname, "data.json");

// Routes
app.get("/", (req, res) => {
  res.render("form", { error: null, values: { income1: "", income2: "" } });
});

app.post("/calculate", async (req, res) => {
  const income1 = parseFloat(req.body.income1);
  const income2 = parseFloat(req.body.income2);

  if (isNaN(income1) || isNaN(income2) || income1 < 0 || income2 < 0) {
    return res.render("form", {
      error: "Please enter valid non-negative numbers.",
      values: { income1: req.body.income1, income2: req.body.income2 },
    });
  }

  const total = income1 + income2;

  // Load existing data
  let records = [];
  if (await fs.pathExists(DATA_FILE)) {
    records = await fs.readJSON(DATA_FILE);
  }

  // Add new record
  const newRecord = {
    income1,
    income2,
    total,
    date: new Date().toISOString(),
  };
  records.push(newRecord);

  // Save back to file
  await fs.writeJSON(DATA_FILE, records, { spaces: 2 });

  res.render("result", { income1, income2, total });
});

// Show stored records
app.get("/records", async (req, res) => {
  let records = [];
  if (await fs.pathExists(DATA_FILE)) {
    records = await fs.readJSON(DATA_FILE);
  }
  res.json(records);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
