// server.js
const express = require("express");
const homeRoutes = require("./routes/home");

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/home", homeRoutes);

// Root welcome message
app.get("/", (req, res) => {
    res.send("API is running. Visit /home for the dashboard.");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});