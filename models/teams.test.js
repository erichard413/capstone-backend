"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Team = require("./teams.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getTeams */

describe("getTeams", function(){
    test("should get teams", async function(){
        const result = await Team.getTeams();
        expect(JSON.stringify(result)).toContain("Boston Bruins");
        expect(JSON.stringify(result)).toContain("San Jose Sharks");
        expect(JSON.stringify(result)).toContain("Tampa Bay Lightning");
    })
});

/************************************** getTeams */

describe("getTeam", function(){
    test("should get team", async function(){
        const result = await Team.getTeam(6);
        expect(JSON.stringify(result)).toContain("Boston Bruins");
    })
});

/************************************** getRoster */

describe("getTeam", function(){
    test("should get roster", async function(){
        const result = await Team.getRoster(6);
        expect(JSON.stringify(result)).toContain("Patrice Bergeron");
    })
});