// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const Student = require("./models/Student");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ROUTES

// Home - View all students
app.get("/", async (req, res) => {
  const students = await Student.find();
  res.render("index", { students });
});

// Add student form
app.get("/add", (req, res) => {
  res.render("add");
});

// Handle Add student
app.post("/add", async (req, res) => {
  const { name, rollNo, class: studentClass, email } = req.body;
  try {
    await Student.create({ name, rollNo, class: studentClass, email });
    res.redirect("/");
  } catch (err) {
    res.send("Error adding student: " + err.message);
  }
});

// Edit student form
app.get("/edit/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("edit", { student });
});

// Handle Edit student
app.post("/edit/:id", async (req, res) => {
  const { name, rollNo, class: studentClass, email } = req.body;
  await Student.findByIdAndUpdate(req.params.id, {
    name,
    rollNo,
    class: studentClass,
    email,
  });
  res.redirect("/");
});

// Delete student
app.get("/delete/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
