"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

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

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          favTeamId: 1,
          email: "new@email.com",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        favTeamId: 1,
        email: "new@email.com",
        isAdmin: false,
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          favTeamId: 1,
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        favTeamId: 1,
        email: "new@email.com",
        isAdmin: true,
      }, token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "not-an-email",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /users/:username/players/:playerId */

describe("POST /users/:username/players/:playerId", function(){
  test("works: USER-> adds player to users' favorite player list", async function(){
    const resp = await request(app).post("/users/u1/players/8470638").set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(201)
    expect(resp.body).toEqual({message: `Player added successfully!`})
  })
  test("works: ADMIN -> adds player to users' favorite player list", async function(){
    const resp = await request(app).post("/users/u1/players/8470638").set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(201)
    expect(resp.body).toEqual({message: `Player added successfully!`})
  })
  test("throws error when no token", async function(){
    const resp = await request(app).post("/users/u1/players/8470638");
    expect(resp.statusCode).toBe(401);
  })
  test("throws error when wrong user token supplied", async function(){
    const resp = await request(app).post("/users/u1/players/8470638").set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toBe(401);
  })
})

/************************************** DELETE /users/:username/players/:playerId */

describe("DELETE /users/:username/players/:playerId", function(){
  test("works: USER-> deletes player from users' favorite player list", async function(){
    await User.addFavoritePlayer("u1", 8470638);
    const userPlayers = await User.getFavoritePlayers("u1");
    expect(JSON.stringify(userPlayers)).toContain("8470638");
    const resp = await request(app).delete("/users/u1/players/8470638").set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: `Player removed successfully!`})
  });
  test("works: ADMIN-> deletes player from users' favorite player list", async function(){
    await User.addFavoritePlayer("u1", 8470638);
    const userPlayers = await User.getFavoritePlayers("u1");
    expect(JSON.stringify(userPlayers)).toContain("8470638");
    const resp = await request(app).delete("/users/u1/players/8470638").set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: `Player removed successfully!`})
  });
  test("throws error when no token", async function(){
    try {
      await request(app).delete("/users/u1/players/8470638")
    } catch(err) {
      expect(err instanceof UnauthorizedError);
    }
  })
  test("throws error when wrong user token", async function(){
    try {
      await request(app).delete("/users/u1/players/8470638").set("authorization", `Bearer ${u2Token}`)
    } catch(err) {
      expect(err instanceof UnauthorizedError);
    }
  })
})

/************************************** GET /users/:username/players */

describe("GET /users/:username/players", function(){
  test("works: USER-> retrieves favorite players for user", async function(){
    await User.addFavoritePlayer("u1", 8470638);
    const resp = await request(app).get("/users/u1/players").set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(JSON.stringify(resp.body)).toContain("8470638");
  });
  test("works: ADMIN-> retrieves favorite players for user", async function(){
    await User.addFavoritePlayer("u1", 8470638);
    const resp = await request(app).get("/users/u1/players").set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
    expect(JSON.stringify(resp.body)).toContain("8470638");
  });
  test("throws error when no token", async function(){
    try{
      await request(app).get("/users/u1/players");
    } catch(err) {
      expect(err instanceof UnauthorizedError);
    }
  });
  test("throws error when wrong user token", async function(){
    try{
      await request(app).get("/users/u1/players").set("authorization", `Bearer ${u2Token}`);
    } catch(err) {
      expect(err instanceof UnauthorizedError);
    }
  });
})

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", function(){
  test("works: USER-> updates the user information", async function(){
    const resp = await request(app).patch("/users/u1").send({
          firstName: "First-updated",
          lastName: "Last-updated"
    }).set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ user: {
      username: "u1",
      firstName: "First-updated",
      lastName: "Last-updated",
      email: "user1@user.com",
      favTeamId: 1,
      isAdmin: false
    }})
  });
  test("works: ADMIN-> updates the user information", async function(){
    const resp = await request(app).patch("/users/u1").send({
          firstName: "First-updated",
          lastName: "Last-updated"
    }).set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ user: {
      username: "u1",
      firstName: "First-updated",
      lastName: "Last-updated",
      email: "user1@user.com",
      favTeamId: 1,
      isAdmin: false
    }})
  });
  test("throws error when no token", async function(){
    try {
      await request(app).patch("/users/u1");
    } catch(err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("throws error when another users' token", async function(){
    try {
      await request(app).patch("/users/u1").set("authorization", `Bearer ${u2Token}`);
    } catch(err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
})

/************************************** POST /users/:username/teams/:teamId */

describe("POST /users/:username/teams/:teamId", function(){
  test("works: USER-> adds team to user's team list", async function(){
    const resp = await request(app).post("/users/u1/teams/6").set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: `Team added successfully!`});
  })
  test("works: ADMIN-> adds team to user's team list", async function(){
    const resp = await request(app).post("/users/u1/teams/6").set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: `Team added successfully!`});
  })
  test("throws error if no token", async function(){
    try {
      await request(app).post("/users/u1/teams/6")
    } catch(err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  })
  test("throws error if another users' token", async function(){
    try {
      await request(app).post("/users/u1/teams/6").set("authorization", `Bearer ${u2Token}`)
    } catch(err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  })
})

/************************************** DELETE /users/:username/teams/:teamId */

describe("DELETE /users/:username/teams/:teamId", function(){
  test("works: USER-> removes team from user's team list", async function(){
    await User.addTeam("u1", 6);
    const resp = await request(app).delete("/users/u1/teams/6").set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: `Team removed successfully!`})
  });
  test("works: ADMIN-> removes team from user's team list", async function(){
    await User.addTeam("u1", 6);
    const resp = await request(app).delete("/users/u1/teams/6").set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: `Team removed successfully!`})
  });
  test("throws error if no token", async function(){
    try {
      await request(app).delete("/users/u1/teams/6");
    } catch(err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("throws error if another users' token", async function(){
    try {
      await request(app).delete("/users/u1/teams/6").set("authorization", `Bearer ${u2Token}`);
    } catch(err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
})

/************************************** GET /users/:username/teams */

describe("GET /users/:username/teams", function(){
  test("works: USER-> gets list of user's favorite teams", async function(){
    await User.addTeam("u1", 6);
    const resp = await request(app).get("/users/u1/teams").set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(JSON.stringify(resp.body)).toContain("Boston Bruins")
  });
  test("works: ADMIN-> gets list of user's favorite teams", async function(){
    await User.addTeam("u1", 6);
    const resp = await request(app).get("/users/u1/teams").set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
    expect(JSON.stringify(resp.body)).toContain("Boston Bruins")
  });
  test("throws error if no token", async function(){
    try{
      await request(app).get("/users/u1/teams");
    } catch(err) {
      expect(err instanceof UnauthorizedError);
    }
  });
  test("throws error if another users' token", async function(){
    try{
      await request(app).get("/users/u1/teams").set("authorization", `Bearer ${u2Token}`);
    } catch(err) {
      expect(err instanceof UnauthorizedError);
    }
  });
})



