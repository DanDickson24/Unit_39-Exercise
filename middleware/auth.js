"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      console.log("Extracted token:", token);
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    console.log("JWT Verification Error:", err);
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

// function ensureLoggedIn(req, res, next) {
//   try {
//     if (!res.locals.user) throw new UnauthorizedError();
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// }

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();

    // Check if is_admin is required for the route
    if (req.requireAdmin && !res.locals.user.is_admin) {
      throw new ForbiddenError("Admin privileges required");
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new ForbiddenError("Admin privileges required");
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
};
