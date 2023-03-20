"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "nhlstats_test"
      : process.env.DATABASE_URL || "nhlstats";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, ACCESS_TOKEN_SECRET);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  ACCESS_TOKEN_SECRET,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};