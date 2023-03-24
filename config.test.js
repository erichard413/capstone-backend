"use strict";

describe("config can come from env", function () {
  test("works", function() {
    process.env.ACCESS_TOKEN_SECRET = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    const config = require("./config");
    expect(config.ACCESS_TOKEN_SECRET).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    delete process.env.ACCESS_TOKEN_SECRET;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    expect(config.getDatabaseUri()).toEqual("nhlstats");
    process.env.NODE_ENV = "test";

    expect(config.getDatabaseUri()).toEqual("nhlstats_test");
  });
})

