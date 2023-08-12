"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

db = new Client({
  user: "test",
  password: "test123",
  host: "localhost",
  port: 5432,
  database: "jobly"
});

getDatabaseUri()

db.connect();

module.exports = db;




// "use strict";
// /** Database setup for jobly. */
// const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");

// let db;

// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     connectionString: getDatabaseUri(),
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// } else {
//   db = new Client({
//     connectionString: getDatabaseUri()
//   });
// }

// db.connect();

// module.exports = db;