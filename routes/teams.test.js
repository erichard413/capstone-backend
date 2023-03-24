"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Team = require("../models/teams");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /teams */

describe("GET /teams", function(){
    test("should retrieve list of teams", async function(){
        const resp = await request(app).get("/teams");
        expect(resp.body.teams.length).toEqual(32);
        expect(JSON.stringify(resp.body.teams)).toContain('Boston Bruins');
    });
});

/************************************** GET /teams/id */

describe("GET /teams/:id", function(){
    test("should retrieve team data of id", async function(){
        const resp = await request(app).get("/teams/6");
        expect(resp.body.team.name).toBe("Boston Bruins");
    });
    test("should error on invalid ID", async function(){
        const resp = await request(app).get("/teams/blah");
        expect(resp.statusCode).toBe(404);
    });
});

/************************************** GET /teams/id/roster */

describe("GET /teams/:id", function(){
    test("should retrieve roster of given team of id", async function(){
        const resp = await request(app).get("/teams/6/roster");
        expect(resp.body.length > 20).toBe(true);
    });
    test("should error on invalid ID", async function(){
        const resp = await request(app).get("/teams/blah");
        expect(resp.statusCode).toBe(404);
    });
});