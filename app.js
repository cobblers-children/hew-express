const path = require("path");
const logger = require('log4js').getLogger('app.js');;
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const correlator = require('express-correlation-id');

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(helmet());
app.use(correlator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
