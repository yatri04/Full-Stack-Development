// src/middleware/errorHandler.js

function notFoundHandler(req, res, next) {
  res.status(404).json({ error: "Not Found" });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = { notFoundHandler, errorHandler };
