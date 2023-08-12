"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "newJob",
    salary: 50000,
    equity: "0.1",
    companyHandle: "c1",
  };

  test("ok for users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "newJob",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      },
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "newJob",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        ...newJob,
        equity: "not-a-number",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "job1",
          salary: 100000,
          equity: "0.1",
          companyHandle: "c1",
        },
        // ... other job objects
      ],
    });
  });

  // ... other test cases
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  // ... test cases
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  // ... test cases
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  // ... test cases
});

/************************************** POST /users/:username/jobs/:id */

describe("POST /users/:username/jobs/:id", function () {
  // ... test cases
});
