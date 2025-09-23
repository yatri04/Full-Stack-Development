// routes/home.js
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Define /home route
router.get("/", homeController.getHomePage);

module.exports = router;