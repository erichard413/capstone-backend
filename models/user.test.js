"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      favTeamId: 1,
      email: "user1@user.com",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    favTeamId: null,
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** add favorite player */

describe("works: adds player to favorite user list", function(){
    test("should add favorite player to user", async function(){
        await User.addFavoritePlayer("u1", 8473541);
        const result = await User.getFavoritePlayers("u1");
        expect(JSON.stringify(result)).toContain("8473541")
    })
});

/************************************** removes favorite player */

describe("works: removes player from favorite user list", function(){
  test("should remove favorite player from user", async function(){
    await User.addFavoritePlayer("u1", 8473541);
    const result = await User.getFavoritePlayers("u1");
    expect(JSON.stringify(result)).toContain("8473541");
    await User.removeFavoritePlayer("u1", 8473541);
    const removed = await User.getFavoritePlayers("u1");
    expect(JSON.stringify(removed)).not.toContain("8473541");
  })
})

/************************************** update user */

describe("works: updates user", function(){
  test("should update information for user", async function(){
    let data = {
    firstName: "U1F-UPDATE",
    lastName: "U1L",
    email: "update@user.com",
    favTeamId: 1
    }
    const result = await User.updateUser("u1", data);
    expect(result).toEqual({
      username: "u1",
      firstName: "U1F-UPDATE",
      lastName: "U1L",
      email: "update@user.com",
      favTeamId: 1,
      isAdmin: false
    })
  })
  test("should throw error if no user", async function(){
    let data = {
      firstName: "U1F-UPDATE",
      lastName: "U1L",
      email: "update@user.com",
      favTeamId: 1
      }
      try {
        const result = await User.updateUser("blah", data);
      } catch(err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
  })
})

/************************************** add team to watch list */

describe("works: adds team to users' watch list", function(){
  test("should add team to watch list", async function(){
    await User.addTeam("u1", 6);
    const result = await User.getUserTeams("u1");
    expect(JSON.stringify(result)).toContain("Boston Bruins");
  })
  test("should throw error if bad username", async function(){
    try {
      await User.addTeam("bad!", 1);
    } catch(err) {
      expect(err instanceof NotFoundError);
    }
  })
})

/************************************** remove team from watch list */

describe("works: removes team from users' watch list", function(){
  test("should remove team from a watch list", async function(){
    await User.addTeam("u1", 6);
    const result = await User.getUserTeams("u1");
    expect(JSON.stringify(result)).toContain("Boston Bruins");
    await User.removeTeam("u1", 6);
    const removed = await User.getUserTeams("u1");
    expect(JSON.stringify(removed)).not.toContain("Boston Bruins");
  })
  test("should throw error if bad username", async function(){
    try {
      await User.removeTeam("bad!", 1);
    } catch(err) {
      expect(err instanceof NotFoundError);
    }
  })
})



