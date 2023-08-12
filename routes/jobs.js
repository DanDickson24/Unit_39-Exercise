"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Job = require("../models/job");
const User = require("../models/user");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = express.Router();

/** POST / { job } => { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: login
 */
router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>  { jobs: [ { id, title, salary, equity, companyHandle }, ... ] }
 *
 * Authorization required: none
 */
// router.get("/", async function (req, res, next) {
//   try {
//     const jobs = await Job.findAll();
//     return res.json({ jobs });
//   } catch (err) {
//     return next(err);
//   }
// });

router.get("/", async function (req, res, next) {
    try {
      const { title, minSalary, hasEquity } = req.query;
  
      const jobs = await Job.findAll(title, minSalary, hasEquity);
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });

/** GET /[id]  =>  { job }
 *
 * job is { id, title, salary, equity, companyHandle }
 *
 * Authorization required: none
 */
router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { job } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: login
 */
router.patch("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: login
 */
router.delete("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

router.post("/:username/jobs/:id", ensureLoggedIn, async function (req, res, next) {
    try {
      const { username, id } = req.params;
      const { isAdmin } = res.locals.user;
  
      if (username !== res.locals.user.username && !isAdmin) {
        throw new BadRequestError("Unauthorized");
      }
  
      const jobId = await User.apply(username, id);
      return res.status(201).json({ applied: jobId });
    } catch (err) {
      return next(err);
    }
  });
  
  module.exports = router;

module.exports = router;
