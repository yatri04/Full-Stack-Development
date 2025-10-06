// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
