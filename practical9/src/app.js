// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
