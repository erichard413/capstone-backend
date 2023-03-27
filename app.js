"use strict";
const cron = require('node-cron');
const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/teams");
const playerRoutes = require("./routes/players");
const Players = require("./models/players");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);

/** This will run every 24 hours to retrieve list of players, and save to the database - this accounts for roster changes. players table is refreshed everytime this function runs. */
cron.schedule('0 0 * * *', async () => {
  await Players.saveAllPlayers();
  console.log(`FETCHED PLAYERS`)
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;