const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  const fileTypes = /pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter,
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to render upload form
app.get("/", (req, res) => {
  res.send(`
    <h2>Upload Resume (PDF only, max 2MB)</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="resume" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Upload route
app.post("/upload", (req, res) => {
  upload.single("resume")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.send("File is too large. Maximum size is 2MB.");
      }
      return res.send(err.message);
    } else if (err) {
      return res.send(err.message);
    }
    if (!req.file) {
      return res.send("Please upload a file.");
    }
    res.send("File uploaded successfully!");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
