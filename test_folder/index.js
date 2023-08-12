// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });


const express = require('express');
const { Client } = require('pg');

const app = express();

// Configure the database connection
const db = new Client({
  user: 'test',
  password: 'test123',
  host: 'localhost',
  port: 5432,
  database: 'jobly'
});

// Connect to the database
db.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Define a route that queries the database
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing database query:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});