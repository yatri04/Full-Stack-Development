const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Path to the log file
const logFilePath = path.join(__dirname, "error.log");

// Route to display log content
app.get("/logs", (req, res) => {
    fs.readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading log file:", err.message);
            return res.status(500).send(`
                <h1>Unable to read log file</h1>
                <p>${err.code === "ENOENT" ? "Log file not found" : "Error accessing log file"}</p>
            `);
        }

        // Display logs in <pre> so formatting is preserved
        res.send(`
            <h1>Error Logs</h1>
            <pre>${data}</pre>
        `);
    });
});

// Root route
app.get("/", (req, res) => {
    res.send(`<h1>Welcome to Log Viewer</h1>
              <p>Go to <a href="/logs">/logs</a> to view error logs.</p>`);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});