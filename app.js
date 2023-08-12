"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use((req, res, next) => {
  console.log("Middleware is called");
  next();
});
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);
app.use((req, res, next) => {
  console.log("Route is reached");
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hello from the server!");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

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
